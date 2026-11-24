import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/token";
import { assertValidObjectId } from "../../../lib/validation/validate";
import { CommentRepository } from "../../comment/repository/comment.repository";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { invalidPostId, postNotFound, unauthorizedPostAction } from "../error";
import { PostDocument } from "../model/post.model";
import { PostRepository } from "../repository/post.repository";

@injectable()
export class PostService {
    constructor(
        @inject(TOKENS.PostRepository) private readonly postRepository: PostRepository,
        @inject(TOKENS.CommentRepository) private readonly commentRepository: CommentRepository
    ) {}

    private async getOwnedPost(postId: string, userId: string): Promise<PostDocument> {
        const post = await this.getPostById(postId);
        if (post.userId.toString() !== userId) {
            throw unauthorizedPostAction;
        }
        return post;
    }

    createPost = async (userId: string, createPostDto: CreatePostDto): Promise<PostDocument> => {
        return this.postRepository.create({
            ...createPostDto,
            userId: new Types.ObjectId(userId),
        });
    };

    getAllUserPosts = async (userId: string): Promise<PostDocument[]> => {
        return this.postRepository.findByUserId(userId);
    };

    getPostById = async (postId: string): Promise<PostDocument> => {
        assertValidObjectId(postId, invalidPostId);
        const post = await this.postRepository.findById(postId);
        if (!post) throw postNotFound;
        return post;
    };

    updatePost = async (
        postId: string,
        userId: string,
        updatePostDto: UpdatePostDto
    ): Promise<PostDocument> => {
        await this.getOwnedPost(postId, userId);
        const updatedPost = await this.postRepository.update(
            { _id: postId, isDeleted: false },
            updatePostDto
        );
        if (!updatedPost) throw postNotFound;
        return updatedPost;
    };

    deletePost = async (postId: string, userId: string): Promise<void> => {
        await this.getOwnedPost(postId, userId);
        await this.postRepository.update({ _id: postId, isDeleted: false }, { isDeleted: true });
        await this.commentRepository.softDeleteByPostId(postId);
    };
}
