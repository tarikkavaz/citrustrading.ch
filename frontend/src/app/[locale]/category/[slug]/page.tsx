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
      <Container size="fluid" className="mt-16">
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto">
              {t("category")}: <span className="text-gray-500">{category?.title || slug}</span>
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8">
                {category?.categoryinfo}
                </p>
                <div dangerouslySetInnerHTML={{ __html: category?.content || '' }} className="mt-4" />
              </div>
              {category?.image && (
                <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 " key={category?.title}>
                  <img src={category?.image} className="rounded-2xl object-cover border-b-8 border-[hsl(var(--citrus-lemon))]" />
                </div>
              )}

            </div>
          </div>
        </div>
      </Container>
      <Container size="fluid" className="mt-6">
        <Container className="py-10">
          <h2 className="text-3xl font-bold tracking-tight dark:text-[hsl(var(--citrus-orange))] ">{t("products")}</h2>
          <div className="grid md:grid-cols-4 gap-10 mt-8">
            {products.map((product) => (
              <div key={product.id} className="group relative rounded-md bg-[hsl(var(--citrus-lemon))]/30 hover:bg-[hsl(var(--citrus-lemon))]/40 border hover:border-[hsl(var(--citrus-lemon))]">
              <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                <div className="h-full w-full object-cover object-center">
                  <img src={product.image ? product.image : '/images/placeholder.jpg'} className="h-full w-full object-cover object-center" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="mt-4 text-xl">
                  <Link href={`/product/${product.slug}`}>
                    <span className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <h4 className="min-h-[3.5rem] text-sm">{product.pageinfo}</h4>
              </div>
              
            </div>
            ))}
          </div>
        </Container>
      </Container>

    </>
  );
}
