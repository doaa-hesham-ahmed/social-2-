import {User, UserDocument} from "../model/user.model";
import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IUser} from "../interface/user.interface";
import {HydratedDocument} from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository extends AbstractRepository<IUser> {

    constructor() {
        super(User);
    }
    //HydratedDocument take anythineg of IUser and added it document(same "_id,__v,createdAt,updatedAt,....")
    async findByEmail(email:string):Promise<UserDocument | null> {
        return this.findOne({ email });
    }
    async findById(id: string): Promise<UserDocument | null> {
    return this.findOne({ _id: id });
}

}

export default new UserRepository();