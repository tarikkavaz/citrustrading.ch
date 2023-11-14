// Import necessary components and types
import { Product, Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";


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

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const category = await getCategoryBySlug(params.locale, params.slug);

  if (!category) {
    // Handle the case where category is undefined
    // For example, return default metadata
    return {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      openGraph: {
        title: t("defaultTitle"),
        description: t("defaultDescription"),
        images: [{ url: DEFAULT_OG_IMAGE_URL }]
      }
    };
  }

  const imageUrl = category.image ? category.image : DEFAULT_OG_IMAGE_URL;
  const description = `${category.title} - ${t("sitedescription")}`;

  return {
    title: `${category.title} | ${t("sitename")}`,
    description: description,
    openGraph: {
      title: `${category.title} | ${t("sitename")}`,
      description: description,
      images: [{ url: imageUrl }]
    }
  };
}

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
        <div>
          <h2>{category?.categoryinfo}</h2>
          <div dangerouslySetInnerHTML={{ __html: category?.content || '' }} className="mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {products.map((product) => (
            <div key={product.id}>
              <Link href={`/product/${product.slug}`}>
              
                  <div>
                    <div>{product.title}</div>
                    <div>{product.pageinfo}</div>
                  </div>
                  <div>
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={product.image ? product.image : "/placeholder.jpg"}
                        priority={true}
                        fill={true}
                        sizes="100%"
                        alt={product.title}
                        className="object-cover"
                      />
                      <img src="{product.image ? product.image : '/images/placeholder.jpg'}" alt="" />
                    </div>
                  </div>

              </Link>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
