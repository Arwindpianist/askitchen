// path/to/EditRecipeForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import type { Recipe } from "@/app/types/recipe";

interface EditRecipeFormProps {
  recipe: Recipe;
  onClose: () => void;
  refreshRecipes: () => void;
}

const EditRecipeForm: React.FC<EditRecipeFormProps> = ({ recipe, onClose, refreshRecipes }) => {
  const [title, setTitle] = useState<string>(recipe.title || ""); // Default to an empty string if null
  const [description, setDescription] = useState<string>(recipe.description || ""); // Default to an empty string if null
  const [ingredients, setIngredients] = useState<string>(recipe.ingredients?.join(", ") || ""); // Default to an empty string if null
  const [instructions, setInstructions] = useState<string>(recipe.instructions?.join("\n") || ""); // Default to an empty string if null
  const [image, setImage] = useState<File | null>(null); // State for the uploaded image
  const [imageUrl, setImageUrl] = useState<string | null>(recipe.image_url || null); // URL of the existing image

  useEffect(() => {
    setTitle(recipe.title || "");
    setDescription(recipe.description || "");
    setIngredients(recipe.ingredients?.join(", ") || "");
    setInstructions(recipe.instructions?.join("\n") || ""); // Initialize instructions
    setImageUrl(recipe.image_url || null); // Initialize image URL
  }, [recipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Set the selected image file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecipe = {
      ...recipe,
      title,
      description,
      ingredients: ingredients.split(", ").map(ingredient => ingredient.trim()), // Convert back to array
      instructions: instructions.split("\n").map(instruction => instruction.trim()), // Convert back to array
    };

    // Upload the image if a new one is selected
    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from("recipe-images") // Ensure you have a bucket named "recipe-images"
        .upload(`public/${recipe.id}/${image.name}`, image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage.from("recipe-images").getPublicUrl(`public/${recipe.id}/${image.name}`);
      if (publicUrlData) {
        updatedRecipe.image_url = publicUrlData.publicUrl; // Set the image URL in the updated recipe
      }
    }

    const { error } = await supabase
      .from("recipes")
      .update(updatedRecipe)
      .eq("id", recipe.id);

    if (error) {
      console.error("Error updating recipe:", error);
    } else {
      refreshRecipes(); // Refresh the recipe list
      onClose(); // Close the edit form
    }
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/2"> {/* Increased width for easier editing */}
        <h2 className="text-2xl font-bold mb-4">Edit Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Ingredients (comma separated):</span>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Instructions (one per line):</span>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
              rows={5} // Set a default number of rows for the textarea
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Upload Image:</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Recipe" 
                className="mt-2 w-32 h-auto rounded-md object-cover" // Downscaled image preview
              />
            )}
          </label>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeForm;