import { Product, Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import {FadeIn, FadeInStagger} from "@/components/animation/FadeIn";
import {SlideIn, SlideInStagger} from "@/components/animation/SlideIn";

const getCategoryBySlug = async (locale: string, slug: string): Promise<Category | undefined> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.find(category => category.slug === slug && category.lang === locale);
};

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

export default async function CategoryPage({
  params: { locale, slug }
}: MetadataProps) {
  const products = await getProductsByCategory(locale, slug);
  const category = await getCategoryBySlug(locale, slug);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container size="fluid" className="mt-16 md:mt-[7.5rem]">
        <div className="relative isolate overflow-hidden">
          <div className="max-w-screen-xl mx-auto pt-10">
            <FadeInStagger>
              <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                <FadeIn>
                  <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto w-fit border-solid border-b-8 border-[hsl(var(--citrus-orange))]">
                  {t("category")}: <span className="text-gray-500">{category?.title || slug}</span>
                  </h1>
                  </FadeIn>
                <FadeIn className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                  <p className="text-lg leading-8">
                  {category?.categoryinfo}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: category?.content || '' }} className="mt-4" />
                </FadeIn>
                {category?.image ? (
                  <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2" key={category?.title}>
                    <img src={category?.image} className="rounded-2xl w-full object-cover border-b-8 border-[hsl(var(--citrus-lemon))]" />
                  </div>
                ) : (
                  <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2"> 
                  <img src="/images/placeholder.jpg" alt="Placeholder" className="rounded-2xl w-full object-cover border-b-8 border-[hsl(var(--citrus-lemon))]"/>
                  </div>
                )}
              </div>
            </FadeInStagger>
          </div>
        </div>
      </Container>

      <Container size="fluid" className="">
        <Container className="py-10">
          <FadeInStagger>
            <FadeIn>
              <h2 className="text-4xl font-bold tracking-tight sm:text-3xl after:bg-[hsl(var(--citrus-lemon))]">{t("products")}</h2>
            </FadeIn>

            <div className="mt-8">
              {products.map((product) => (
              <FadeIn key={product.id} className="group relative mb-4 border-b-2 border-[hsl(var(--citrus-lemon))]/30 last:border-b-0">
                <div className="py-3 my-2">
                  <h3 className="text-xl font-bold">
                    {product.title}
                  </h3>
                  <h4 className="text-sm">{product.pageinfo}</h4>
                </div>
              </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </Container>
    </>
  );
}
