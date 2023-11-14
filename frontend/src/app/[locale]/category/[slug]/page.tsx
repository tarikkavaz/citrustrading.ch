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
      <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              We’re changing the way people connect.
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
              alt=""
              className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
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
                    <h3>{product.title}</h3>
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
                      <img src={product.image ? product.image : '/images/placeholder.jpg'} className="hidden" />
                    </div>
                  </div>
                  <h4>{product.pageinfo}</h4>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
