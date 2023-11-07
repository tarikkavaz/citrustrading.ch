// Import necessary components and types
import { Product, Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";

// Fetch products based on category slug
const getProductsByCategory = async (locale: string, categorySlug: string): Promise<Product[]> => {
  const productsEndpoint = `/api/products/`;
  const allProducts: Product[] = await fetchData(API_URL, productsEndpoint);
  const filteredProducts = allProducts.filter(product =>
    product.categories.some(category => category.slug === categorySlug && category.lang === locale)
  );
  return filteredProducts;
};

// Component that renders products of a specific category
export default async function CategoryPage({
  params: { locale, slug }
}: MetadataProps) {
  const products = await getProductsByCategory(locale, slug);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16">
        <h1>{t("category")}: {slug}</h1>
        <div className="grid grid-flow-col grid-cols-3 gap-4">
          {products.map((product) => (
            <Link href={`/${locale}/product/${product.slug}`} key={product.id}>
              
                <Image
                  src={product.image ? product.image : "/images/placeholder.jpg"}
                  width={300}
                  height={200}
                  alt={product.title}
                />
                <h2>{product.title}</h2>
              
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
