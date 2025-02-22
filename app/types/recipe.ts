export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  image_url: string | null;
  created_at: string;
} 