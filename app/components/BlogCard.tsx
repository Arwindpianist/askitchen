"use client";
import { supabase } from "@/app/lib/supabase";

// Define the BlogPost type
type BlogPost = {
  id: string;
  title: string;
  content: string;
};

export default function BlogCard({
  blog,
  refreshBlogs,
  onEdit,
}: {
  blog: BlogPost;
  refreshBlogs: () => void;
  onEdit: () => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", blog.id);
    if (error) alert("Error deleting blog post");
    else refreshBlogs();
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
      <p className="text-gray-600 mb-4 text-justify break-words">{blog.content}</p>
      <div className="flex space-x-4">
        <button onClick={onEdit} className="btn-primary">
          Edit
        </button>
        <button onClick={handleDelete} className="btn-secondary">
          Delete
        </button>
      </div>
    </div>
  );
}