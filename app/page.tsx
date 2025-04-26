import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/app/types/recipe";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SubscribeForm from "@/app/components/SubscribeForm";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = "force-dynamic"; // Ensures no caching

export default async function HomePage() {
  const { data: recipes } = await supabase.from("recipes").select("*");

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-purple-700 text-center mb-12">
            Welcome to ASKitchen
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.map((recipe) => (
              <div key={recipe.id} className="card shadow-purple-400 hover:shadow-md transition-shadow overflow-hidden">
                {recipe.image_url && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      fill
                      className="object-cover rounded-t-lg"
                      priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-purple-700 mb-2">{recipe.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                  <Link 
                    href={`/recipe/${recipe.id}`}
                    className="btn-secondary inline-block"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
