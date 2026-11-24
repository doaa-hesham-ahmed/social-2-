import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { IComment } from "../interface/comment.interface";
import { Comment, CommentDocument } from "../model/comment.model";

@injectable()
export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return this.findOne({ _id: id, isDeleted: false });
    }

    async findByPostId(postId: string): Promise<CommentDocument[]> {
        return this.find({ postId, isDeleted: false }, { sort: { createdAt: -1 } });
    }

    async softDeleteByPostId(postId: string): Promise<void> {
        await this.updateMany({ postId, isDeleted: false }, { isDeleted: true });
    }
}
