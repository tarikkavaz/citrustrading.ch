import {
  Homepage,
  MetadataProps,
  HomeProps,
  ContentImage,
} from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL, SERVER_IP } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Loader2 } from "lucide-react";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { Metadata, ResolvingMetadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const getHomepage = async (): Promise<Homepage[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/homepage/`;
  const products = await fetchData(API_URL, endpoint);
  return products;
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
  const homepage = products[0];
  const t = await getTranslator(locale, "Globals");
  return (
    <>
      <Container className="px-10 mt-16" id="content">
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {homepage.images &&
            homepage.images.map((image: ContentImage) => (
              <picture key={image.id}>
                <Image
                  src={image.image}
                  priority={true}
                  width={500}
                  height={300}
                  alt={image.alt_text}
                  className="bg-accent"
                />
              </picture>
            ))}
        </div>
        <h1>{homepage.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: homepage.content }} />
        <hr className="h-0.5 my-10 bg-accent" />
        <h2 className="mt-16">{t("products")}</h2>
      </Container>
      <Container>
        <div className="grid md:grid-cols-3 gap-4">
          {homepage.products &&
            homepage.products.map((product) => (
              <Card key={product.id}>
                <Link href={`/product/${product.slug}`}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.pageinfo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={product.image ? product.image : "/images/placeholder.jpg"}
                        priority={true}
                        fill={true}
                        alt={product.title}
                        className=" object-cover"
                      />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
      </Container>
      <Container size="fluid" className="hidden">
      <GlobalCarousel 
          images={homepage.images || []} 
          className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent" 
        />
      </Container>
    </>
  );
}
