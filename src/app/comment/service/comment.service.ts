import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/token";
import { assertValidObjectId } from "../../../lib/validation/validate";
import { commentsDisabled, invalidPostId, postNotFound } from "../../post/error";
import { PostDocument } from "../../post/model/post.model";
import { PostRepository } from "../../post/repository/post.repository";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import {
    commentNotFound,
    invalidCommentId,
    invalidParentComment,
    unauthorizedCommentAction,
} from "../error";
import { CommentDocument } from "../model/comment.model";
import { CommentRepository } from "../repository/comment.repository";

@injectable()
export class CommentService {
    constructor(
        @inject(TOKENS.CommentRepository) private readonly commentRepository: CommentRepository,
        @inject(TOKENS.PostRepository) private readonly postRepository: PostRepository
    ) {}

    private async getExistingPost(postId: string): Promise<PostDocument> {
        assertValidObjectId(postId, invalidPostId);
        const post = await this.postRepository.findById(postId);
        if (!post) throw postNotFound;
        return post;
    }

    createComment = async (
        postId: string,
        userId: string,
        createCommentDto: CreateCommentDto
    ): Promise<CommentDocument> => {
        const post = await this.getExistingPost(postId);
        if (!post.allowsComments) throw commentsDisabled;

        let parentObjectId: Types.ObjectId | null = null;
        if (createCommentDto.parentId) {
            assertValidObjectId(createCommentDto.parentId, invalidCommentId);
            const parentComment = await this.commentRepository.findById(createCommentDto.parentId);
            if (!parentComment || parentComment.postId.toString() !== postId) {
                throw invalidParentComment;
            }
            parentObjectId = new Types.ObjectId(createCommentDto.parentId);
        }

        const comment = await this.commentRepository.create({
            content: createCommentDto.content,
            userId: new Types.ObjectId(userId),
            postId: new Types.ObjectId(postId),
            parentId: parentObjectId,
        });

        await this.postRepository.incrementCommentsCount(postId, 1);
        return comment;
    };

    getPostComments = async (postId: string): Promise<CommentDocument[]> => {
        await this.getExistingPost(postId);
        return this.commentRepository.findByPostId(postId);
    };

    getCommentById = async (commentId: string): Promise<CommentDocument> => {
        assertValidObjectId(commentId, invalidCommentId);
        const comment = await this.commentRepository.findById(commentId);
        if (!comment) throw commentNotFound;
        return comment;
    };

    updateComment = async (
        commentId: string,
        userId: string,
        updateCommentDto: UpdateCommentDto
    ): Promise<CommentDocument> => {
        const comment = await this.getCommentById(commentId);
        if (comment.userId.toString() !== userId) {
            throw unauthorizedCommentAction;
        }

        const updatedComment = await this.commentRepository.update(
            { _id: commentId, isDeleted: false },
            { content: updateCommentDto.content }
        );
        if (!updatedComment) throw commentNotFound;
        return updatedComment;
    };

    deleteComment = async (commentId: string, userId: string): Promise<void> => {
        const comment = await this.getCommentById(commentId);
        const post = await this.postRepository.findById(comment.postId.toString());

        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner = post?.userId.toString() === userId;
        if (!isCommentOwner && !isPostOwner) {
            throw unauthorizedCommentAction;
        }

        await this.commentRepository.update({ _id: commentId, isDeleted: false }, { isDeleted: true });
        if (post && post.commentsCount > 0) {
            await this.postRepository.incrementCommentsCount(post._id.toString(), -1);
        }
    };
}
