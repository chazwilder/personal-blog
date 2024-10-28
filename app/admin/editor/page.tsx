"use client";
import React, { KeyboardEvent, useEffect, useState } from "react";
import BlogEditor from "@/components/admin/BlogEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { FolderIcon, ImageIcon, Plus, Tag, X } from "lucide-react";
import type { OutputData } from "@editorjs/editorjs";
import { Category } from "@/types/blog";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<OutputData | null>(null);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (response.ok) {
        await fetchCategories();
        setNewCategory("");
        setIsAddingCategory(false);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleEditorChange = (data: OutputData) => {
    setContent(data);
    console.log("Editor content updated:", data);
  };

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.trim();

    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      addTag(value);
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = (tag: string) => {
    const processedTag = tag.replace(/,/g, "").trim();
    if (processedTag && !tags.includes(processedTag)) {
      setTags([...tags, processedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(",")) {
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      newTags.forEach((tag) => addTag(tag));
    } else {
      setInputValue(value);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }

    if (!content || !content.blocks || content.blocks.length === 0) {
      alert("Please add some content");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          featuredImage,
          status: "draft",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      const data = await response.json();
      console.log("Draft saved:", data);
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }

    if (!content || !content.blocks || content.blocks.length === 0) {
      alert("Please add some content");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          featuredImage,
          status: "published",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      const data = await response.json();
      console.log("Post published:", data);
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white flex flex-row h-full flex-grow">
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="border-b border-gray-200 bg-white p-2 flex flex-row">
          <div className="w-auto flex flex-nowrap text-3xl p-2 pl-8 italic">
            Post Title:
          </div>
          <div className="w-1/2 flex flex-row">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              className="w-full text-4xl font-bold p-2 pl-8 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="w-11/12 mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BlogEditor onChange={handleEditorChange} initialData={content} />
          </div>
        </div>
      </main>

      <aside className="border-l border-gray-200 bg-white w-80 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-6 justify-center">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Featured Image
          </h3>
          <ImageUpload
            onImageSelect={(url) => setFeaturedImage(url)}
            initialImage={featuredImage}
          />
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FolderIcon className="w-4 h-4" /> Categories
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
                        handleAddCategory();
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

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Tags
          </h3>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[32px] border rounded-md p-1.5 bg-white focus-within:ring-1 focus-within:ring-black focus-within:border-black">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="group rounded-sm"
                  >
                    <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleTagInput}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="flex-1 min-w-[80px] inline-flex border-0 focus:outline-none focus:ring-0 text-sm placeholder-gray-400 bg-transparent p-0.5"
              />
            </div>
            <p className="text-xs text-gray-500 pl-1">
              Press enter or add a comma after each tag
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default WritePage;
