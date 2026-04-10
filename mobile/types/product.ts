export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  galleryImages: string[];
  category: string | null;
}
