import { getCurrentUser } from "@/lib/session";
import { getUploadSignedUrl } from "@/lib/storage/service";
import { NextRequest } from "next/server";

// api endpoint for uploading public files
// uploaded files will be public, anyone can access the file
// uploading public files requires authentication
// use this to upload files for a specific resource, e.g. a user profile picture or a survey
// this api endpoint will return a signed url for uploading the file to s3 and another url for uploading file to the local storage

export interface ApiSuccessResponse<T = { [key: string]: any }> {
  data: T;
}

export async function POST(req: NextRequest): Promise<Response> {
  const { fileName, fileType, environmentId, allowedFileExtensions } = await req.json();

  if (!fileName) {
    return new Response("fileName is required", { status: 400 });
  }

  if (!fileType) {
    return new Response("fileType is required", { status: 400 });
  }

  if (allowedFileExtensions?.length) {
    const fileExtension = fileName.split(".").pop();
    if (!fileExtension || !allowedFileExtensions.includes(fileExtension)) {
      //   return responses.badRequestResponse(
      //     `File extension is not allowed, allowed extensions are: ${allowedFileExtensions.join(", ")}`
      //   );
      return new Response(
        `File extension is not allowed, allowed extensions are: ${allowedFileExtensions.join(", ")}`,
        { status: 400 }
      );
    }
  }

  // auth and upload private file
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return new Response("User must be authenticated to perform this action.", { status: 401 });
  }
  const accessType = "public";

  try {
    const signedUrlResponse = await getUploadSignedUrl(fileName, environmentId, fileType, accessType);
    return new Response(JSON.stringify({ data: signedUrlResponse }), {
      status: 200,
    });
  } catch (err) {
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}
