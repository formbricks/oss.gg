import { getS3File } from "@/lib/storage/service";

const getFile = async (environmentId: string, accessType: string, fileName: string) => {
  try {
    const signedUrl = await getS3File(`${environmentId}/${accessType}/${fileName}`);

    return new Response(null, {
      status: 302,
      headers: {
        Location: signedUrl,
      },
    });
  } catch (err) {
    if (err.name === "NoSuchKey") {
      return new Response("File not found", { status: 404 });
    } else {
      return new Response("Something went wrong", { status: 500 });
    }
  }
};

export default getFile;
