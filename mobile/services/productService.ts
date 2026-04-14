import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { Product } from "@/types/product";
import { buildUploadUrl } from "./api";

const PRODUCTS_CACHE_KEY = "@furnigo:products_cache";

interface ProductCachePayload {
  products: Product[];
  updatedAt: number;
}

let memoryProducts: Product[] | null = null;
let memoryProductsById = new Map<string, Product>();

function syncProductMemory(products: Product[]) {
  memoryProducts = products;
  memoryProductsById = new Map(products.map((product) => [product.id, product]));
}

async function readProductsCache(): Promise<Product[] | null> {
  if (memoryProducts) {
    return memoryProducts;
  }

  try {
    const raw = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ProductCachePayload;
    syncProductMemory(parsed.products);
    return parsed.products;
  } catch {
    return null;
  }
}

async function writeProductsCache(products: Product[]) {
  syncProductMemory(products);

  const payload: ProductCachePayload = {
    products,
    updatedAt: Date.now(),
  };

  await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(payload));
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>("/products");
    await writeProductsCache(response.data);
    return response.data;
  } catch (error) {
    const cachedProducts = await readProductsCache();

    if (cachedProducts) {
      return cachedProducts;
    }

    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
  const cachedProducts = await readProductsCache();
  const cachedProduct = memoryProductsById.get(id) ?? cachedProducts?.find((product) => product.id === id);

  try {
    const response = await api.get<Product>(`/products/${id}`);
    const freshProduct = response.data;

    await writeProductsCache(
      cachedProducts
        ? cachedProducts.some((product) => product.id === id)
          ? cachedProducts.map((product) => (product.id === id ? freshProduct : product))
          : [...cachedProducts, freshProduct]
        : [freshProduct]
    );

    return freshProduct;
  } catch (error) {
    if (cachedProduct) {
      return cachedProduct;
    }

    throw error;
  }
}

export function formatProductPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getSimilarProducts(products: Product[], currentProduct: Product, limit = 4): Product[] {
  return products
    .filter((product) => product.id !== currentProduct.id)
    .sort((left, right) => {
      const leftScore = left.category === currentProduct.category ? 1 : 0;
      const rightScore = right.category === currentProduct.category ? 1 : 0;

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return Math.abs(left.price - currentProduct.price) - Math.abs(right.price - currentProduct.price);
    })
    .slice(0, limit);
}

export function getCachedProductImageSource(pathOrFileName: string | null | undefined) {
  const uri = buildUploadUrl(pathOrFileName) ?? "https://via.placeholder.com/600x750?text=FurniGo";

  return {
    uri,
    cache: "force-cache" as const,
  };
}
