"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import AdminHeader from "@/app/components/AdminHeader";
import RecipeForm from "@/app/components/RecipeForm";
import RecipeCard from "@/app/components/RecipeCard";
import EditRecipeForm from "@/app/components/EditRecipeForm";
import type { Recipe } from "@/app/types/recipe";

const allowedEmails: string[] = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(",") || [];

export default function AdminRecipePage() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
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

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleCloseEdit = () => {
    setEditingRecipe(null);
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
      <main className="min-h-screen py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card mb-8 shadow-md">
            <RecipeForm refreshRecipes={fetchRecipes} />
            {editingRecipe && (
              <EditRecipeForm
                recipe={editingRecipe}
                onClose={handleCloseEdit}
                refreshRecipes={fetchRecipes}
              />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Recipes</h2>
          <div className="space-y-4">
            {recipes.length === 0 ? (
              <p className="text-gray-600 text-center py-12">No recipes added yet.</p>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  refreshRecipes={fetchRecipes}
                  onEdit={() => handleEditRecipe(recipe)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}