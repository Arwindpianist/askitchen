"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function EditBlogForm({
  blog,
  onClose,
  refreshBlogs,
}: {
  blog: {
    id: string;
    title: string;
    content: string;
    images: string[];
  };
  onClose: () => void;
  refreshBlogs: () => void;
}) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BLOG_IMAGES_BUCKET || "blog-images";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const uploadedImages: string[] = [];
    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, image);
      if (error) {
        alert(`Image upload failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      uploadedImages.push(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`);
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({ title, content, images: uploadedImages.length > 0 ? uploadedImages : blog.images })
      .eq("id", blog.id);
    if (error) {
      alert("Error updating blog post");
    } else {
      alert("Blog post updated successfully!");
      refreshBlogs();
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field"
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input-field min-h-[150px]"
        required
      />
      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files || []))}
        className="input-field"
      />
      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Update Blog Post"}
      </button>
      <button type="button" className="btn-secondary w-full" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
}