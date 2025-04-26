"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogForm from "@/app/components/BlogForm";
import BlogCard from "@/app/components/BlogCard";
import EditBlogForm from "@/app/components/EditBlogForm";
import type { BlogPost } from "@/app/types/blog";
import AdminHeader from "@/app/components/AdminHeader";

const allowedEmails: string[] = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",") || [];

export default function AdminBlogPage() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }

      if (!data?.user?.email || !allowedEmails.includes(data.user.email)) {
        alert("Unauthorized access.");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
      fetchBlogPosts();
    };

    checkAuth();
  }, [router]);

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setBlogPosts(data || []);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
  };

  const handleCloseEdit = () => {
    setEditingBlog(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Blog Panel</h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>

          <div className="card mb-8">
            <BlogForm refreshBlogs={fetchBlogPosts} />
            {editingBlog && (
              <EditBlogForm
                blog={editingBlog}
                onClose={handleCloseEdit}
                refreshBlogs={fetchBlogPosts}
              />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Blog Posts</h2>
          <div className="space-y-4">
            {blogPosts.length === 0 ? (
              <p className="text-gray-600 text-center py-12">No blogs added yet.</p>
            ) : (
              blogPosts.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  refreshBlogs={fetchBlogPosts}
                  onEdit={() => handleEditBlog(blog)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}