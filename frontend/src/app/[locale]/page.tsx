import {
  Homepage,
  MetadataProps,
  HomeProps,
  Category
} from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL, SERVER_IP } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { Metadata, ResolvingMetadata } from "next";


const getHomepage = async (): Promise<Homepage[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/homepage/`;
  const products = await fetchData(API_URL, endpoint);
  return products;
};

const getCategories = async (locale: string): Promise<Category[]> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.filter(category => category.lang === locale);
};

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const products = await getHomepage();
  const firstProduct = products[0];

  const firstImageUrl =
    firstProduct.images && firstProduct.images[0]
      ? firstProduct.images[0].image
      : DEFAULT_OG_IMAGE_URL;

  const description = `${firstProduct.pageinfo} - ${t("sitedescription")}`;
  const title = `${firstProduct.title} | ${t("sitename")}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: firstImageUrl }],
    },
  };
}

export default async function Products({ params: { locale } }: HomeProps) {
  const products = await getHomepage();
  const categories = await getCategories(locale);
  const homepage = products[0];
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container size="fluid">
        <div className="relative">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
              <svg
                className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white dark:fill-black lg:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="0,0 90,0 50,100 0,100" />
              </svg>
              <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl dark:text-[hsl(var(--citrus-lemon))]">
                  {homepage.title} <br className="hidden lg:inline" />
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-[hsl(var(--citrus-orange))]">
                    {homepage.pageinfo}
                  </p>
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: homepage.content }}  className="mt-6 text-lg leading-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            {homepage.images && homepage.images.length > 0 && (
              <GlobalCarousel 
                images={homepage.images || []} 
                className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full" 
              />
            )}
          </div>
        </div>
      </Container>
      <hr />

      {homepage.products && homepage.products.length > 0 && (
      <Container size="fluid" className="bg-gradient-to-b from-[hsl(var(--citrus-lemon))]/20 to-[hsl(var(--citrus-orange))]/20 dark:from-[hsl(var(--citrus-lemon))]/10 dark:to-[hsl(var(--citrus-orange))]/10">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8 ">
          <h2 className="text-3xl font-bold tracking-tight dark:text-[hsl(var(--citrus-orange))] ">{t("featuredproducts")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
          {homepage.products.map((product) => (
            <div key={product.id} className="group relative rounded-md bg-white/60 hover:bg-[hsl(var(--citrus-lemon))]/40 border hover:border-[hsl(var(--citrus-lemon))]">
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
        </div>
      </Container>
      )}
      <hr />

      <Container>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight dark:text-[hsl(var(--citrus-lemon))]">{t("categories")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {categories.map((category) => (
              <div key={category.id} className="group relative rounded-md bg-[hsl(var(--citrus-lemon))]/30 hover:bg-[hsl(var(--citrus-lemon))]/40 border hover:border-[hsl(var(--citrus-lemon))]">
                <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                  <div className="h-full w-full object-cover object-center">
                    <img src={category.image ? category.image : '/images/placeholder.jpg'} className="h-full w-full object-cover object-center" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="mt-4 text-xl">
                    <Link href={`/${locale}/category/${category.slug}`}>
                      <span className="absolute inset-0" />
                      {category.title}
                    </Link>
                  </h3>
                  <h4 className="min-h-[3.5rem] text-sm">{category.categoryinfo}</h4>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
