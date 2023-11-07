// Import necessary components and types
import { Product, Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Helper function to fetch the category by slug
const getCategoryBySlug = async (locale: string, slug: string): Promise<Category | undefined> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.find(category => category.slug === slug && category.lang === locale);
};

// Helper function to fetch products by category slug
const getProductsByCategory = async (locale: string, categorySlug: string): Promise<Product[]> => {
  const productsEndpoint = `/api/products/`;
  const allProducts: Product[] = await fetchData(API_URL, productsEndpoint);
  const filteredProducts = allProducts.filter(product =>
    product.categories.some(category => category.slug === categorySlug && category.lang === locale)
  );
  return filteredProducts;
};

// The main component for the category page
export default async function CategoryPage({
  params: { locale, slug }
}: MetadataProps) {
  // Fetch both products and category details
  const products = await getProductsByCategory(locale, slug);
  const category = await getCategoryBySlug(locale, slug);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16">
        {/* Use category title if available, otherwise fallback to slug */}
        <h1>{t("category")}: {category?.title || slug}</h1>
        <div className="grid grid-flow-col grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <Link href={`/product/${product.slug}`}>
              
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.pageinfo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={product.image ? product.image : "/placeholder.jpg"}
                        priority={true}
                        fill={true}
                        alt={product.title}
                        className="object-cover"
                      />
                    </div>
                  </CardContent>

              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
