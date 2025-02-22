import { supabase } from "@/app/lib/supabase";
import type { Recipe } from "@/app/types/recipe";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default async function RecipesPage() {
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order('created_at', { ascending: false }) as { data: Recipe[] | null };

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text mb-8">All Recipes</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.map((recipe) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="group">
                <div className="border border-text/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-background h-full">
                  <img 
                    src={recipe.image_url || "/placeholder.jpg"} 
                    alt={recipe.title} 
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h2>
                    {recipe.description && (
                      <p className="text-text-muted mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-sm text-text-muted">
                      <span>{recipe.ingredients.length} ingredients</span>
                      <span className="mx-2">•</span>
                      <span>{recipe.instructions.length} steps</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {(!recipes || recipes.length === 0) && (
            <div className="text-center text-text-muted py-12">
              No recipes found.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 