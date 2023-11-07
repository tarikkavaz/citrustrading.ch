import { Category, Product, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from 'next/image';
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const locale = params.locale;

  const categories = await getCategories();
  const matchedCategory = categories.find((category) => category.slug === slug);
  const title = matchedCategory?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  const description = `${title} | ${t("category")} - ${t("sitedescription")}`;
  const pageTitle = `${title} | ${t("sitename")}`;

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      images: [{ url: DEFAULT_OG_IMAGE_URL }],
    },
  };
}

const getCategories = async (): Promise<Category[]> => {
  const endpoint = `/api/categories/`;
  return await fetchData(API_URL, endpoint);
};

const getCategoryProducts = async (
  slug: string,
  locale: string
): Promise<Product[]> => {
  const endpoint = `/api/${locale}/categories/${slug}/`;
  const products = await fetchData(API_URL, endpoint);
  const filteredProducts = products.filter(
    (product: { lang: string }) => product.lang === locale
  );
  return filteredProducts;
};

export default async function Page({
  params: { locale, slug },
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const products = await getCategoryProducts(slug, locale);
  const categories = await getCategories();
  const matchedCategory = categories.find((category) => category.slug === slug);
  const title = matchedCategory?.title || "Başlık";
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16" id="content">
      <h1>
        {t("category")}: <span>{title}</span>
      </h1>
      <div className="grid grid-flow-col grid-cols-3 gap-4">
          {products.map((product) => (
              <>
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
              </>
          ))}
        </div>
    </Container>
    </>
  );
}
