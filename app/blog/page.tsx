import { supabase } from "@/app/lib/supabase";
import type { BlogPost } from "@/app/types/blog";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-purple-700 text-center mb-12">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group">
                <div className="card hover:shadow-md transition-shadow overflow-hidden">
                  {post.images.length > 0 && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {(!blogPosts || blogPosts.length === 0) && (
            <p className="text-center text-gray-600 py-12">No blogs available.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}