import { getCurrentUser } from "@/lib/session";
import { ZStorageRetrievalParams } from "@/types/storage";
import { NextRequest } from "next/server";

import { handleDeleteFile } from "./lib/deleteFile";
import getFile from "./lib/getFile";

export async function GET(
  _: NextRequest,
  { params }: { params: { repositoryId: string; accessType: string; fileName: string } }
) {
  const paramValidation = ZStorageRetrievalParams.safeParse(params);

  if (!paramValidation.success) {
    return new Response("Fields are missing or incorrectly formatted", { status: 400 });
  }

  const { repositoryId, accessType, fileName: fileNameOG } = paramValidation.data;

  const fileName = decodeURIComponent(fileNameOG);

  // maybe we might have private files in future that would require some sort of authentication
  if (accessType === "public") {
    return await getFile(repositoryId, accessType, fileName);
  }

  // if the user is authenticated via the session
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return new Response("User must be authenticated to perform this action.", { status: 401 });
  }

  return await getFile(repositoryId, accessType, fileName);
}

export async function DELETE(_: NextRequest, { params }: { params: { fileName: string } }) {
  if (!params.fileName) {
    return new Response("Fields are missing or incorrectly formatted", { status: 400 });
  }

  const [repositoryId, accessType, file] = params.fileName.split("/");

  const paramValidation = ZStorageRetrievalParams.safeParse({ fileName: file, repositoryId, accessType });

  if (!paramValidation.success) {
    return new Response("Fields are missing or incorrectly formatted", { status: 400 });
  }

  //check if the user is authenticated

  const user = await getCurrentUser();

  if (!user || !user.id) {
    return new Response("User must be authenticated to perform this action.", { status: 401 });
  }

  return await handleDeleteFile(
    paramValidation.data.repositoryId,
    paramValidation.data.accessType,
    paramValidation.data.fileName
  );
}
