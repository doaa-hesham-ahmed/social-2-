import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { IPost } from "../interface/post.interface";
import { Post, PostDocument } from "../model/post.model";

@injectable()
export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }

    async findById(id: string): Promise<PostDocument | null> {
        return this.findOne({ _id: id, isDeleted: false });
    }

    async findByUserId(userId: string): Promise<PostDocument[]> {
        return this.find({ userId, isDeleted: false }, { sort: { createdAt: -1 } });
    }

    async incrementCommentsCount(postId: string, delta: number): Promise<PostDocument | null> {
        return this.update({ _id: postId, isDeleted: false }, { $inc: { commentsCount: delta } });
    }
}
