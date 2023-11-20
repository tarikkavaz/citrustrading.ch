import { Category, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { fetchData, API_URL } from "@/utils/api";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';
import {FadeIn, FadeInStagger} from "@/components/animation/FadeIn";

const getCategories = async (locale: string): Promise<Category[]> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.filter(category => category.lang === locale);
};

export async function generateMetadata({ params: { locale } }: MetadataProps) {
  const t = await getTranslator(locale, "Globals");

  const description = `${t("categories")} - ${t("sitedescription")}`;
  const pageTitle = `${t("categories")} | ${t("sitename")}`;

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
    <Container size="fluid" className="mt-16">
      <Container className="py-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl after:bg-[hsl(var(--citrus-orange))]">{t("categories")}</h1>
        <FadeInStagger>
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
  );
}
