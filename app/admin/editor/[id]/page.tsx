"use client";
import React from "react";
import EditorPage from "@/components/admin/EditorPage";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  return <EditorPage postId={params.id as string} />;
}
