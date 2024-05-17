//TODO: would hook this later
import { storageCache } from "@/lib/storage/service";
import { deleteFile } from "@/lib/storage/service";
import { TAccessType } from "@/types/storage";

export const handleDeleteFile = async (repositoryId: string, accessType: TAccessType, fileName: string) => {
  try {
    const { message, success, code } = await deleteFile(repositoryId, accessType, fileName);

    if (success) {
      // revalidate cache
      storageCache.revalidate({ fileKey: `${repositoryId}/${accessType}/${fileName}` });
      return Response.json(
        {
          data: message,
          success: true,
        },
        { status: 200 }
      );
    }

    if (code === 404) {
      return Response.json("File not found", { status: 404 });
    }

    return Response.json(
      {
        error: message,
      },
      { status: 500 }
    );
  } catch (err) {
    return Response.json("internal server error", { status: 500 });
  }
};
