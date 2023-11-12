import { Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";

const getCategories = async (locale: string): Promise<Category[]> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.filter(category => category.lang === locale);
};

export async function generateMetadata({ params: { locale } }: MetadataProps) {
  const t = await getTranslator(locale, "Globals");

  const description = `${t("products")} - ${t("sitedescription")}`;
  const pageTitle = `${t("products")} | ${t("sitename")}`;

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


export default async function CategoriesPage({ params: { locale } }: MetadataProps) {
  const categories = await getCategories(locale);
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="p-10 mt-16">
        {/* <h1>{t("categories")}</h1> */}
        <h1>{t("products")}</h1>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {categories.map((category) => (
            <>
              <Card key={category.id}>
                <Link href={`/${locale}/category/${category.slug}`}>
                
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={category.image ? category.image : "/placeholder.jpg"}
                          priority={true}
                          fill={true}
                          alt={category.title}
                          className="object-cover"
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
