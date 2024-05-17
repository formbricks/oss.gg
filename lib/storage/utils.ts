export const getFileNameWithIdFromUrl = (fileURL: string) => {
  try {
    const fileNameFromURL = fileURL.startsWith("/storage/")
      ? fileURL.split("/").pop()
      : new URL(fileURL).pathname.split("/").pop();

    return fileNameFromURL ? decodeURIComponent(fileNameFromURL || "") : "";
  } catch (error) {
    console.error("Error parsing file URL:", error);
  }
};
