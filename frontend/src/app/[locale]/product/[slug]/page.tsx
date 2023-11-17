import { Product, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { useLocale } from "next-intl";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import { Button } from "@/components/ui/button";

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const slug = params.slug;
  const product = await getProduct(slug);

  const imageUrl = product.image ? product.image : DEFAULT_OG_IMAGE_URL;
  const description = `${product.pageinfo} - ${t("sitedescription")}`;

  return {
    title: `${product.title} | ${t("sitename")}`,
    description: description,
    openGraph: {
      title: `${product.title} | ${t("sitename")}`,
      description: description,
      images: [{ url: imageUrl }]
    }
  };
}

const getProduct = async (slug: string): Promise<Product> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/product/${slug}`;
  const product = await fetchData(API_URL, endpoint);
  return product;
};

export default async function Page({
  params: { locale, slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const product = await getProduct(slug);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container size="fluid" className="mt-16">
        <div className="relative isolate overflow-hidden">
          <div className="max-w-screen-xl mx-auto pt-10">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto w-fit border-solid border-b-8 border-[hsl(var(--citrus-lemon))]">
                {product.title}
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <div className="text-lg leading-8">
                {product?.pageinfo}
                </div>
                <div dangerouslySetInnerHTML={{ __html: product?.content || '' }} className="text-lg leading-8" />
                {product.categories.length > 0 && (
                <div className="mt-16">
                  <h3 className="max-w-2xl text-xl font-bold tracking-tight lg:col-span-2 xl:col-auto mb-5 w-fit border-solid border-b-4 border-[hsl(var(--citrus-lemon))]">{t("categories")}:</h3>
                  <div className="flex items-center gap-x-3">
                    {product.categories.map((category) => (
                      <Link key={category.slug} href={`/${locale}/category/${category.slug}`}>
                        <Button variant="orange" className="font-bold">{category.title}</Button>
                      </Link>
                    ))}
                </div>
                </div>
              )}
              <div className="mt-16">
                {product.shoplink && (
                <div className="mt-8" key={product.title}>
                  <Link href={product.shoplink || '#'}>
                    <Button variant="lemon" size="lg" className="font-bold flex items-center gap-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      <span>{t("buy")}</span>
                    </Button>
                  </Link>
                </div>
                )}
              </div>
              </div>
              {product?.image && (
                <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2" key={product?.title}>
                  <img src={product?.image} className="rounded-2xl w-full object-cover border-b-8 border-[hsl(var(--citrus-lemon))]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    
      <Container size="fluid" className="">
        {product.images && product.images.length > 0 && (
        <div className="relative isolate overflow-hidden">
          <div className="max-w-screen-xl mx-auto pt-10">
            <GlobalCarousel 
              images={product.images} 
              className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent md:rounded-2xl" 
            />
          </div>
        </div>
        )}
      </Container>
    </>
  );
}
