import {ICloudProvider} from "./cloud.interface";
import {S3Client} from "@aws-sdk/client-s3";
import {PutObjectCommand,DeleteObjectCommand,GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as buffer from "node:buffer";
import { toSeconds } from "../utils/time";

interface S3config{
    region:string;
    accessKey:string;
    secretKey:string;
    bucketName:string;
}

export class S3CloudProvider implements ICloudProvider {
    //encaspulations
    private client: S3Client;
    private readonly bucketName:string;
    constructor(config:S3config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            }
        })
        this.bucketName = config.bucketName;
    }
    public async generatePresignedUrl(file: Express.Multer.File , path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            ContentType:file.mimetype,
            Key:`${path} / ${file.originalname}`,
        })
        return await getSignedUrl(this.client,command,{expiresIn:toSeconds(3,'hours')})
    }
        public async uploadFile(file: Express.Multer.File , path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Body:file.buffer,
            ContentType:file.mimetype,
            Key:`${path} /${new Date().toISOString()} - ${file.originalname}`,
        })
         await this.client.send(command);
        return command.input.Key as string;
    }
    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket:this.bucketName,
            Key:key,
        })
        await this.client.send(command);
    }

    public async getFile(key: string): Promise<Buffer> {
        // const command = new GetObjectCommand({
        //     Bucket:this.bucketName,
        //     Key:key,
        // })
        // await this.client.send(command);
        return Promise.resolve(new Buffer("88"))
    }

}

