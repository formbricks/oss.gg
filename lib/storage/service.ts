import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { PresignedPostOptions, createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { add, isAfter, parseISO } from "date-fns";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

import { MAX_SIZE, S3_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION, S3_SECRET_KEY, WEBAPP_URL } from "../constants";

const ZAccessType = z.enum(["public", "private"]);
type TAccessType = z.infer<typeof ZAccessType>;

// S3Client Singleton
let s3ClientInstance: S3Client | null = null;

export const getS3Client = () => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      credentials: {
        accessKeyId: S3_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_KEY!,
      },
      region: S3_REGION,
    });
  }
  return s3ClientInstance;
};

export const storageCache = {
  tag: {
    byFileKey(filekey: string): string {
      return `storage-filekey-${filekey}`;
    },
  },
  revalidate({ fileKey }: { fileKey: string }): void {
    revalidateTag(this.tag.byFileKey(fileKey));
  },
};

export const testS3BucketAccess = async () => {
  const s3Client = getS3Client();

  try {
    // Attempt to retrieve metadata about the bucket
    const headBucketCommand = new HeadBucketCommand({
      Bucket: S3_BUCKET_NAME,
    });

    await s3Client.send(headBucketCommand);

    return true;
  } catch (error) {
    console.error("Failed to access S3 bucket:", error);
    throw new Error(`S3 Bucket Access Test Failed: ${error}`);
  }
};

type TGetFileResponse = {
  fileBuffer: Buffer;
  metaData: {
    contentType: string;
  };
};

// discriminated union
type TGetSignedUrlResponse =
  | { signedUrl: string; fileUrl: string; presignedFields: Object }
  | {
      signedUrl: string;
      updatedFileName: string;
      fileUrl: string;
      signingData: {
        signature: string;
        timestamp: number;
        uuid: string;
      };
    };

const getS3SignedUrl = async (fileKey: string): Promise<string> => {
  const [_, accessType] = fileKey.split("/");
  const expiresIn = accessType === "public" ? 60 * 60 : 10 * 60;
  const revalidateAfter = accessType === "public" ? expiresIn - 60 * 5 : expiresIn - 60 * 2;

  return unstable_cache(
    async () => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
      });

      try {
        const s3Client = getS3Client();
        return await getSignedUrl(s3Client, getObjectCommand, { expiresIn });
      } catch (err) {
        throw err;
      }
    },
    [`getFileFromS3-${fileKey}`],
    {
      revalidate: revalidateAfter,
      tags: [storageCache.tag.byFileKey(fileKey)],
    }
  )();
};

export const getS3File = async (fileKey: string): Promise<string> => {
  const signedUrl = await getS3SignedUrl(fileKey);
  const signedUrlObject = new URL(signedUrl);

  // The logic below is to check if the signed url has expired.
  // We do this by parsing the X-Amz-Date and Expires query parameters from the signed url
  // and checking if the current time is past the expiration time.
  // If it is, we generate a new signed url and return that instead.
  // We do this because the time-based revalidation for the signed url is not working as expected. (mayve a bug in next.js caching?)

  const amzDate = signedUrlObject.searchParams.get("X-Amz-Date");
  const amzExpires = signedUrlObject.searchParams.get("X-Amz-Expires");

  if (amzDate && amzExpires) {
    const expiresAfterSeconds = parseInt(amzExpires, 10);
    const currentDate = new Date();

    // Get the UTC components
    const yearUTC = currentDate.getUTCFullYear();
    const monthUTC = (currentDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const dayUTC = currentDate.getUTCDate().toString().padStart(2, "0");
    const hoursUTC = currentDate.getUTCHours().toString().padStart(2, "0");
    const minutesUTC = currentDate.getUTCMinutes().toString().padStart(2, "0");
    const secondsUTC = currentDate.getUTCSeconds().toString().padStart(2, "0");

    // Construct the date-time string in UTC format
    const currentDateTimeUTC = `${yearUTC}${monthUTC}${dayUTC}T${hoursUTC}${minutesUTC}${secondsUTC}Z`;

    const amzSigningDate = parseISO(amzDate);
    const amzExpiryDate = add(amzSigningDate, { seconds: expiresAfterSeconds });
    const currentDateISO = parseISO(currentDateTimeUTC);

    const isExpired = isAfter(currentDateISO, amzExpiryDate);

    if (isExpired) {
      // generate a new signed url
      storageCache.revalidate({ fileKey });
      const signedUrlAfterRefetch = await getS3SignedUrl(fileKey);
      return signedUrlAfterRefetch;
    }
  }

  return signedUrl;
};

// ingle service for generating a signed url based on user's environment variables
export const getUploadSignedUrl = async (
  fileName: string,
  repositoryId: string,
  fileType: string,
  accessType: TAccessType
): Promise<TGetSignedUrlResponse> => {
  // add a unique id to the file name
  const fileExtension = fileName.split(".").pop();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".");

  if (!fileExtension) {
    throw new Error("File extension not found");
  }

  const updatedFileName = `${fileNameWithoutExtension}--fid--${randomUUID()}.${fileExtension}`;

  try {
    const { presignedFields, signedUrl } = await getS3UploadSignedUrl(
      updatedFileName,
      fileType,
      accessType,
      repositoryId
    );

    return {
      signedUrl,
      presignedFields,
      fileUrl: new URL(`${WEBAPP_URL}/storage/${repositoryId}/${accessType}/${updatedFileName}`).href,
    };
  } catch (err) {
    throw err;
  }
};

export const getS3UploadSignedUrl = async (
  fileName: string,
  contentType: string,
  accessType: string,
  repositoryId: string
) => {
  const maxSize = MAX_SIZE;
  const postConditions: PresignedPostOptions["Conditions"] = [["content-length-range", 0, maxSize]];

  try {
    const s3Client = getS3Client();
    const { fields, url } = await createPresignedPost(s3Client, {
      Expires: 10 * 60, // 10 minutes
      Bucket: S3_BUCKET_NAME,
      Key: `${repositoryId}/${accessType}/${fileName}`,
      Fields: {
        "Content-Type": contentType,
      },
      Conditions: postConditions,
    });

    return {
      signedUrl: url,
      presignedFields: fields,
    };
  } catch (err) {
    throw err;
  }
};

// a single service to put file in the storage(local or S3), based on the S3 configuration
export const putFile = async (
  fileName: string,
  fileBuffer: Buffer,
  accessType: TAccessType,
  repositoryId: string
) => {
  try {
    const input = {
      Body: fileBuffer,
      Bucket: S3_BUCKET_NAME,
      Key: `${repositoryId}/${accessType}/${fileName}`,
    };

    const command = new PutObjectCommand(input);
    const s3Client = getS3Client();
    await s3Client.send(command);
    return { success: true, message: "File uploaded" };
  } catch (err) {
    throw err;
  }
};

export const deleteFile = async (repositoryId: string, accessType: TAccessType, fileName: string) => {
  try {
    await deleteS3File(`${repositoryId}/${accessType}/${fileName}`);
    return { success: true, message: "File deleted" };
  } catch (err: any) {
    if (err.name === "NoSuchKey") {
      return { success: false, message: "File not found", code: 404 };
    } else {
      return { success: false, message: err.message ?? "Something went wrong" };
    }
  }
};

export const deleteS3File = async (fileKey: string) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const s3Client = getS3Client();
    await s3Client.send(deleteObjectCommand);
  } catch (err) {
    throw err;
  }
};

export const deleteS3FilesByRepositoryId = async (repositoryId: string) => {
  try {
    // List all objects in the bucket with the prefix of repositoryId
    const s3Client = getS3Client();
    const listObjectsOutput = await s3Client.send(
      new ListObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Prefix: repositoryId,
      })
    );

    if (listObjectsOutput.Contents) {
      const objectsToDelete = listObjectsOutput.Contents.map((obj) => {
        return { Key: obj.Key };
      });

      if (!objectsToDelete.length) {
        // no objects to delete
        return null;
      }

      // Delete the objects
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: S3_BUCKET_NAME,
          Delete: {
            Objects: objectsToDelete,
          },
        })
      );
    } else {
      // no objects to delete
      return null;
    }
  } catch (err) {
    throw err;
  }
};
