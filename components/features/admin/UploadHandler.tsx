export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    if (data.success) {
      return data.imageUrl;
    } else {
      throw new Error(data.error || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
