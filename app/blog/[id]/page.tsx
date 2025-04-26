import type { Metadata } from "next";
import { supabase } from "@/app/lib/supabase";
import type { BlogPost } from "@/app/types/blog";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  return {
    title: `Blog ${resolvedParams.id}`,
  };
};

async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single<BlogPost>();

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-purple-50">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-gray-900 text-center">Blog not found</p>
            <Link href="/blog" className="btn-secondary mt-8 block text-center mx-auto w-fit">
              Back to Blogs
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            {post.images.length > 0 && (
              <Image
                src={post.images[0]}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-60 object-cover rounded-lg mb-6"
                priority
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-600 mb-8 text-justify break-words">{post.content}</p>
          </div>

          <Link href="/blog" className="btn-secondary mt-8 inline-block">
            Back to Blogs
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BlogPage;