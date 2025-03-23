// path/to/RecipeCard.tsx
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type { Recipe } from "@/app/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  refreshRecipes: () => Promise<void>;
  onEdit: () => void; // Added onEdit prop to the interface
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, refreshRecipes, onEdit }) => {
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{recipe.title}</h3>
          <p className="text-gray-600">{recipe.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit} // Use the onEdit prop
            className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 transition"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h4 className="font-medium text-gray-800 mb-1">Ingredients:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-1">Instructions:</h4>
          <ol className="list-decimal list-inside text-gray-600">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;