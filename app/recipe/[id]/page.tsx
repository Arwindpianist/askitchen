import type { Metadata } from "next";
import { supabase } from "@/app/lib/supabase";
import type { Recipe } from "@/app/types/recipe";
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
    title: `Recipe ${resolvedParams.id}`,
  };
};

async function RecipePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single<Recipe>();

  if (error || !recipe) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-purple-50">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-gray-900 text-center">Recipe not found</p>
            <Link href="/" className="btn-secondary mt-8 block text-center mx-auto w-fit">
              Back to Recipes
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
            {recipe.image_url && (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                width={800}
                height={400}
                className="w-full h-60 object-cover rounded-lg mb-6"
                priority
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            <p className="text-gray-600 mb-8">{recipe.description}</p>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  ingredient.trim() === "" ? (
                    <div key={index} className="h-4"></div> // Spacer for empty newlines
                  ) : (
                    <li key={index}>{ingredient}</li>
                  )
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="list-decimal list-inside text-gray-600 space-y-4">
                {recipe.instructions.map((step, index) => (
                  step.trim() === "" ? (
                    <div key={index} className="h-4"></div> // Spacer for empty newlines
                  ) : (
                    <li key={index}>{step}</li>
                  )
                ))}
              </ol>
            </div>
          </div>

          <Link href="/" className="btn-secondary mt-8 inline-block">
            Back to Recipes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RecipePage;
