import { Product, ContentImage, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import Infoblock from "@/components/Infoblock";
import { useLocale } from "next-intl";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import { badgeVariants } from "@/components/ui/badge"
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
      <Infoblock />
      <Container className="p-10 mt-16" id="content">
        {product.image && (
          <div className="my-10 relative w-full h-[500px]" key={product.title}>
            <Image
              src={product.image}
              priority={true}
              fill={true}
              alt={product.title}
              className=" object-cover"
            />
            <img src={product.image} className="hidden" />
          </div>
        )}

        <h1 className="mt-12">{product.title}</h1>
        {product.shoplink && (
          <h2 className="mt-12" key={product.title}>
            <Link href={product.shoplink || '#'}>
              <Button>
                {t("buy")}
              </Button>
            </Link>
          </h2>
        )}
        <div dangerouslySetInnerHTML={{ __html: product.content }} />

        

        {product.images && product.images.length > 0 && (
        <div className="mt-8">
          <GlobalCarousel 
            images={product.images} 
            navigationEnabled={false} 
            className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent" 
          />
        </div>
        )}
        
        <div className="grid grid-cols-4 gap-4 mt-8">
          {product.images &&
            product.images.map((img: ContentImage) => (
              <picture key={img.id}>
                <Image
                  src={img.image}
                  width={500}
                  height={300}
                  alt={img.alt_text}
                />
                <img src={img.image} className="hidden" />
              </picture>
            ))}
        </div>

        
      </Container>
      <Container>
      {product.categories.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-3 text-base">{t("categories")}:</h3>
              {product.categories.map((category) => (
                <Link key={category.slug} href={`/${locale}/category/${category.slug}`} className={`${badgeVariants({ variant: "default" })} mr-1`}>{category.title}</Link>
              ))}
          </div>
        )}

      </Container>
    </>
  );
}
