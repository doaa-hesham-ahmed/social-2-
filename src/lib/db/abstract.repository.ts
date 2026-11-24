import {DeleteResult, HydratedDocument, Model, QueryFilter, QueryOptions, UpdateQuery, UpdateWriteOpResult} from "mongoose";

export abstract class AbstractRepository <T> {
    protected constructor(private readonly model: Model<T>) {
    }

    async create(data: Partial<T>):Promise<HydratedDocument<T>>{
       return this.model.create(data)
    }

    async update(filter:QueryFilter <T> , newData:UpdateQuery<T> | Partial<T>,options?:QueryOptions):Promise<HydratedDocument<T> | null>{
        return this.model.findOneAndUpdate(filter,newData,{ new: true, ...options });
    }
    async updateMany(filter:QueryFilter<T>, newData:UpdateQuery<T>):Promise<UpdateWriteOpResult>{
        return this.model.updateMany(filter, newData);
    }
    async delete(filter:QueryFilter<T>):Promise<DeleteResult>{
        return this.model.deleteOne(filter);
    }
    async findOne(filter:QueryFilter<T>):Promise<HydratedDocument<T> | null>{
        return this.model.findOne(filter);
    }
    async find(filter:QueryFilter<T>, options?:QueryOptions):Promise<HydratedDocument<T>[]>{
        return this.model.find(filter, null, options);
    }

}