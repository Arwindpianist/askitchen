import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface RecipeFormProps {
  refreshRecipes: () => void;
}

export default function RecipeForm({ refreshRecipes }: RecipeFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from("recipe-images").upload(fileName, imageFile);

      if (error) {
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }

      imageUrl = `${SUPABASE_URL}/storage/v1/object/public/recipe-images/${fileName}`;
    }

    const { error } = await supabase.from("recipes").insert([
      {
        title,
        description,
        ingredients: ingredients.split("\n"),
        instructions: instructions.split("\n"),
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert("Error adding recipe");
      setIsSubmitting(false);
    } else {
      alert("Recipe added successfully!");
      refreshRecipes();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-text font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2">Ingredients (one per line)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="input-field min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2">Instructions (one per line)</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="input-field min-h-[100px]"
          required
        />
      </div>

      <input type="file" className="border p-2 w-full mt-2" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />

      <button 
        type="submit"
        className="btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding Recipe...' : 'Add Recipe'}
      </button>
    </form>
  );
}
