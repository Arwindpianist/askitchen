export interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[]; // Array of image URLs
  created_at: string;
}