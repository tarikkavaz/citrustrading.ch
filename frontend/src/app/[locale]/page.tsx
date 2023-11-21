import {
  Homepage,
  MetadataProps,
  HomeProps,
  Category
} from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import Link from "next/link";
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { Metadata, ResolvingMetadata } from "next";
import {FadeIn, FadeInStagger} from "@/components/animation/FadeIn";
import {SlideIn, SlideInStagger} from "@/components/animation/SlideIn";
import SearchResults from "@/components/SearchResults";

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
      <Container size="fluid" className="bg-white dark:bg-black">
        <div className="relative">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
              {/* <svg
                className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white dark:fill-black lg:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="0,0 90,0 50,100 0,100" />
              </svg> */}
              <div className="relative pr-6 py-10 md:py-32 sm:py-40 lg:py-56 lg:pr-0">
                <FadeInStagger className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                  <FadeIn>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl after:bg-gray-400">
                    {homepage.title} <br className="hidden lg:inline" />
                    </h1>
                  </FadeIn>
                  <FadeIn>
                    <p className="mt-6 text-3xl">
                      {homepage.pageinfo}
                    </p>
                  </FadeIn>
                  <FadeIn>
                    <div dangerouslySetInnerHTML={{ __html: homepage.content }}  className="mt-6 text-lg leading-8" />
                  </FadeIn>
                </FadeInStagger>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full">
            {homepage.images && homepage.images.length > 0 ? (
              <GlobalCarousel
                images={homepage.images || []} 
                className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full rounded-2xl md:rounded-none md:rounded-bl-[150px]" 
              />
            ) : (
              <img src="/images/placeholder.jpg" alt="Placeholder" className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full rounded-2xl md:rounded-none md:rounded-bl-[150px]" />
            )}
            </div>
          </div>
        </div>
      </Container>

      {homepage.products && homepage.products.length > 0 && (
      <Container size="fluid" className="mt-16">
        <Container className="py-10">
          <FadeInStagger>
            <FadeIn>
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl after:bg-[hsl(var(--citrus-lemon))]">{t("featuredproducts")}</h2>
            </FadeIn>
            <div className="grid md:grid-cols-4 gap-10 mt-8">
              {homepage.products.map((product) => (
              <FadeIn key={product.id} className="group relative rounded-2xl bg-[hsl(var(--citrus-lemon))]/30 hover:bg-[hsl(var(--citrus-lemon))]/40 border hover:border-[hsl(var(--citrus-lemon))]">
                <Link href={`/product/${product.slug}`}>
                  <div className="h-56 w-full overflow-hidden rounded-2xl bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                    <div className="h-full w-full object-cover object-center">
                      <img src={product.image ? product.image : '/images/placeholder.jpg'} className="h-full w-full object-cover object-center border-b-8 border-[hsl(var(--citrus-lemon))]" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="mt-4  text-xl">
                        <span className="absolute inset-0" />
                        {product.title}
                    </h3>
                    <h4 className="min-h-[3.5rem] text-sm">{product.pageinfo}</h4>
                  </div>
                </Link>
              </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </Container>
      )}

      <Container size="fluid" className="mt-16">
        <Container className="py-10">
          <FadeInStagger>
          <FadeIn>
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl after:bg-[hsl(var(--citrus-orange))]">{t("categories")}</h2>
          </FadeIn>
            <div className="grid md:grid-cols-4 gap-10 mt-8">
              {categories.map((category) => (
              <FadeIn key={category.slug} className="group relative rounded-2xl bg-[hsl(var(--citrus-orange))]/30 hover:bg-[hsl(var(--citrus-orange))]/40 border hover:border-[hsl(var(--citrus-orange))]">
                <Link href={`/category/${category.slug}`}>
                <div className="h-56 w-full overflow-hidden rounded-2xl bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                  <div className="h-full w-full object-cover object-center">
                    <img src={category.image ? category.image : '/images/placeholder.jpg'} className="h-full w-full object-cover object-center border-b-8 border-[hsl(var(--citrus-orange))]" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="mt-4  text-xl">
                    <span className="absolute inset-0" />
                    {category.title}
                  </h3>
                  <h4 className="min-h-[3.5rem] text-sm">{category.categoryinfo}</h4>
                </div>
                </Link>
              </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </Container>
      <Container className="mt-16">
        <SearchResults />
      </Container>
    </>
  );
}
