import { Page, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';

const getPages = async (): Promise<Page[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/pages/`;
  const pages = await fetchData(API_URL, endpoint);

  return pages;
};

export async function generateMetadata({ params: { locale } }: MetadataProps) {
  const t = await getTranslator(locale, "Globals");

  const description = `${t("pages")} - ${t("sitedescription")}`;
  const pageTitle = `${t("pages")} | ${t("sitename")}`;

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

export default async function Pages({ params: { locale } }: MetadataProps) {
  const pages = await getPages();
  const t = await getTranslator(locale, "Globals");
  return (
    <>
      <Container className="p-10 mt-16">
        <h1>{t("pages")}</h1>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {pages.map((page) => (
              <>
                <div key={page.id}>
                <Link href={`/page/${page.slug}`}>
                  <div>
                    <h2>{page.title}</h2>
                  </div>
                  <div>
                  {page.image && (
                    <div className="relative w-full h-[300px]">
                      <img src={page.image} className="object-cover border-b-8 border-[hsl(var(--citrus-lemon))]" />
                    </div>
                  )}
                  </div>
                  <h3>{page.pageinfo}</h3>
                  </Link>
                </div>
              </>
          ))}
        </div>
      </Container>
    </>
  );
}
