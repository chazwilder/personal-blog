import React, { useCallback, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (imageData: { url: string; imageId: string }) => void;
  initialImage?: { url: string; imageId?: string };
}

const ImageUpload = ({ onImageSelect, initialImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage?.url || null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setIsUploading(false);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setIsUploading(false);
      return;
    }

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
        setPreviewUrl(data.imageUrl);
        onImageSelect({
          url: data.imageUrl,
          imageId: data.imageId,
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageSelect({ url: "", imageId: "" });
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${isUploading ? "bg-gray-50" : "hover:bg-gray-50"}
          ${error ? "border-red-300" : "border-gray-300"}
        `}
      >
        {previewUrl ? (
          <div className="relative group">
            <div className="aspect-video relative">
              <Image
                src={previewUrl}
                alt="Featured image"
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-md flex items-center justify-center gap-4">
              <label
                htmlFor="featured-image"
                className="hidden group-hover:flex items-center gap-2 text-white cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Change
              </label>
              <button
                onClick={removeImage}
                className="hidden group-hover:flex items-center gap-2 text-white"
              >
                <X className="w-5 h-5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="featured-image"
            className="cursor-pointer flex flex-col items-center"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500">
              {isUploading
                ? "Uploading..."
                : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        )}
        <input
          type="file"
          id="featured-image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
      {error && <p className="text-sm text-red-500 pl-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
