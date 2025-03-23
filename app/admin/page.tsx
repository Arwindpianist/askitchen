// path/to/AdminPage.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import RecipeForm from "@/app/components/RecipeForm";
import RecipeCard from "@/app/components/RecipeCard";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EditRecipeForm from "@/app/components/EditRecipeForm"; // New import for editing recipes
import type { Recipe } from "@/app/types/recipe";

const allowedEmails: string[] = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",") || [];

export default function AdminPage() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null); // State to hold the recipe being edited
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
      fetchRecipes();
    };

    checkAuth();
  }, [router]);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from("recipes").select("*");
    if (error) console.error(error);
    else setRecipes(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe); // Set the recipe to be edited
  };

  const handleCloseEdit = () => {
    setEditingRecipe(null); // Close the edit form
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-text-muted">Loading...</p>
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-text">Admin Panel</h1>
            <button 
              onClick={handleSignOut} 
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
          
          <div className="card mb-8">
            <RecipeForm refreshRecipes={fetchRecipes} />
            {editingRecipe && ( // Render the edit form if a recipe is being edited
              <EditRecipeForm 
                recipe={editingRecipe} 
                onClose={handleCloseEdit} 
                refreshRecipes={fetchRecipes} 
              />
            )}
          </div>

          <h2 className="text-2xl font-bold text-text mb-6">Manage Recipes</h2>
          <div className="space-y-4">
            {recipes.length === 0 ? (
              <p className="text-text-muted text-center py-12">No recipes added yet.</p>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  refreshRecipes={fetchRecipes} 
                  onEdit={() => handleEditRecipe(recipe)} // Pass the edit handler to RecipeCard
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