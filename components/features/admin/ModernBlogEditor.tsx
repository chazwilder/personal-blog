"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  FolderIcon,
  ImageIcon,
  Plus,
  Save,
  Send,
  Tag,
  X,
  Settings,
} from "lucide-react";
import ImageUpload from "@/components/features/admin/ImageUpload";
import { ICategory } from "@/database/category.model";
import type { OutputData } from "@editorjs/editorjs";

const BlogEditor = dynamic(
  () => import("@/components/features/admin/BlogEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full" />
      </div>
    ),
  },
);

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  focusKeywords: string[];
  ogImage?: string;
}

interface ModernBlogEditorProps {
  initialData: {
    title: string;
    content: OutputData | null;
    category: string;
    tags: string[];
    featuredImage: string;
    featuredImageId?: string;
    seo?: SEOData;
  } | null;
  categories: ICategory[];
  onSave: (data: any) => Promise<void>;
  onPublish: (data: any) => Promise<void>;
  onAddCategory: (name: string) => Promise<boolean>;
  isEditMode: boolean;
}

export default function ModernBlogEditor({
  initialData,
  categories,
  onSave,
  onPublish,
  onAddCategory,
  isEditMode,
}: ModernBlogEditorProps) {
  // Existing state
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState<OutputData | null>(
    initialData?.content || null,
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [inputValue, setInputValue] = useState("");
  const [featuredImage, setFeaturedImage] = useState<{
    url: string;
    imageId?: string;
  }>(
    initialData?.featuredImage
      ? {
          url: initialData.featuredImage,
          imageId: initialData.featuredImageId,
        }
      : { url: "", imageId: "" },
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // New SEO state
  const [seo, setSeo] = useState<SEOData>(
    initialData?.seo || {
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      focusKeywords: [],
      ogImage: "",
    },
  );
  const [keywordInput, setKeywordInput] = useState("");

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }

    if (!content || !content.blocks || content.blocks.length === 0) {
      alert("Please add some content");
      return;
    }

    if (status === "published" && !category) {
      alert("Please select a category");
      return;
    }

    setIsSaving(true);
    try {
      const formData = {
        title,
        content,
        category,
        tags,
        featuredImage: featuredImage.url,
        featuredImageId: featuredImage.imageId,
        status,
        seo: {
          ...seo,
          metaTitle: seo.metaTitle || title,
          metaDescription:
            seo.metaDescription || content.blocks[0]?.data?.text?.slice(0, 155),
        },
      };

      if (status === "published") {
        await onPublish(formData);
      } else {
        await onSave(formData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;
    const success = await onAddCategory(newCategory);
    if (success) {
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword && !seo.focusKeywords.includes(keyword)) {
      setSeo((prev) => ({
        ...prev,
        focusKeywords: [...prev.focusKeywords, keyword],
      }));
    }
    setKeywordInput("");
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSeo((prev) => ({
      ...prev,
      focusKeywords: prev.focusKeywords.filter((k) => k !== keyword),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-auto sm:h-16 bg-white border-b flex flex-col sm:flex-row items-start sm:items-center p-4 sm:px-6 gap-4 sm:gap-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="text-xl sm:text-2xl font-medium bg-transparent border-none focus:outline-none w-full sm:w-auto flex-1 mr-0 sm:mr-4"
          />
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSaving
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Save Draft"}
              </span>
              <span className="sm:hidden">Save</span>
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-sm bg-main text-black rounded-lg hover:bg-main/90"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSaving ? "Publishing..." : "Publish"}
              </span>
              <span className="sm:hidden">Publish</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto px-2 sm:px-6 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4">
            <BlogEditor
              onChange={setContent}
              initialData={content}
              postId={isEditMode ? initialData?.title : undefined}
            />
          </div>
        </div>
      </div>

      {/* Sidebar - Convert to bottom sheet on mobile */}
      <div className="lg:w-80 bg-white border-t lg:border-l flex flex-col">
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Featured Image */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Featured Image
            </h3>
            <ImageUpload
              onImageSelect={(imageData) => setFeaturedImage(imageData)}
              initialImage={
                featuredImage.url
                  ? {
                      url: featuredImage.url,
                      imageId: featuredImage.imageId,
                    }
                  : undefined
              }
            />
          </div>

          {/* Category */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FolderIcon className="w-4 h-4" />
              Category
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[32px] border rounded-md p-1.5 bg-white focus-within:ring-1 focus-within:ring-black focus-within:border-black">
                {isAddingCategory ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddNewCategory();
                        } else if (e.key === "Escape") {
                          setIsAddingCategory(false);
                          setNewCategory("");
                        }
                      }}
                      placeholder="New category name..."
                      className="flex-1 border-0 focus:outline-none focus:ring-0 text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategory("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {category && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {category}
                        <button
                          type="button"
                          onClick={() => setCategory("")}
                          className="group rounded-sm"
                        >
                          <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      </span>
                    )}
                    {!category && (
                      <div className="flex-1 flex items-center justify-between">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0 text-sm bg-transparent"
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setIsAddingCategory(true)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Add new category"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[32px] border rounded-md p-1.5 bg-white focus-within:ring-1 focus-within:ring-black focus-within:border-black">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-white font-medium text-gray-800 hover:bg-gray-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="group rounded-sm"
                    >
                      <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue) {
                      setTags([...tags, inputValue]);
                      setInputValue("");
                    }
                  }}
                  placeholder={tags.length === 0 ? "Add tags..." : ""}
                  className="flex-1 min-w-[60px] bg-white border-0 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">Press enter to add a tag</p>
            </div>
          </div>
          {/* SEO Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              SEO Settings
            </h3>
            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seo.metaTitle}
                  onChange={(e) =>
                    setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  placeholder="Enter meta title"
                  className="mt-1 w-full bg-white text-black rounded-md border p-2 text-sm"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-black">
                  {seo.metaTitle.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  value={seo.metaDescription}
                  onChange={(e) =>
                    setSeo((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="Enter meta description..."
                  className="mt-1 w-full bg-white rounded-md border p-2 text-sm"
                  rows={3}
                  maxLength={155}
                />
                <p className="mt-1 text-xs text-black">
                  {seo.metaDescription.length}/155 characters
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) =>
                    setSeo((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/blog/post"
                  className="mt-1 w-full rounded-md border bg-white p-2 text-sm"
                />
              </div>

              {/* Focus Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Focus Keywords
                </label>
                <div className="mt-1 flex flex-wrap gap-2 min-h-[32px] border rounded-md p-1.5 bg-white">
                  {seo.focusKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-white text-gray-800"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && keywordInput) {
                        e.preventDefault();
                        handleAddKeyword(keywordInput);
                      }
                    }}
                    placeholder="Add keywords..."
                    className="flex-1 min-w-[60px] border-0 bg-white text-black focus:outline-none focus:ring-0 text-sm p-1"
                  />
                </div>
              </div>

              {/* OG Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={seo.ogImage}
                  onChange={(e) =>
                    setSeo((prev) => ({ ...prev, ogImage: e.target.value }))
                  }
                  placeholder="https://example.com/og-image.jpg"
                  className="mt-1 w-full bg-white text-black rounded-md border p-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
