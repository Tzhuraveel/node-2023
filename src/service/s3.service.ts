import { extname } from "node:path";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";
import { v4 } from "uuid";

import { configs } from "../config";

class S3Service {
  constructor(
    private client: S3Client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    })
  ) {}

  public async uploadPhoto(
    file: UploadedFile,
    itemType: string,
    itemId: Types.ObjectId
  ): Promise<string> {
    const filePath = this.buildPathForUpdate(file.name, itemType, itemId);

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: filePath,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: configs.AWS_S3_ACL,
      })
    );
    return filePath;
  }

  public async deleteAvatar(photoName: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: photoName,
      })
    );
  }

  private buildPathForUpdate(
    fileName: string,
    itemType: string,
    itemId: Types.ObjectId
  ): string {
    extname(fileName);
    return `${itemType}/${itemId}/${v4()}${extname(fileName)}`;
  }
}
export const s3Service = new S3Service();
