import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type { Recipe } from "@/app/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  refreshRecipes: () => void;
}

export default function RecipeCard({ recipe, refreshRecipes }: RecipeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    setIsDeleting(true);
    const { error } = await supabase.from("recipes").delete().eq("id", recipe.id);
    if (error) alert("Error deleting recipe");
    else refreshRecipes();
    setIsDeleting(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-text">{recipe.title}</h3>
          <p className="text-text-muted">{recipe.description}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-text mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside text-text-muted">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-text mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside text-text-muted">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
} 