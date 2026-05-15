import { s3, BUCKET_NAME } from '../config/s3.config.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadDocumentToBucketS3 = async (bucketName: string, s3Key: string, file: Buffer<ArrayBufferLike>, contentType: string): Promise<boolean> => {
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: file,
        ContentType: contentType
    }))
    return true;
};
