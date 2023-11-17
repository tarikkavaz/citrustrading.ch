import { Page, ContentImage, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import { fetchData, API_URL } from "@/utils/api"; // Imported API_URL
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslator(params.locale, "Globals");
  const page = await getPage(params.slug);

  const imageUrl = page.image ? page.image : DEFAULT_OG_IMAGE_URL;
  const description = `${page.pageinfo} - ${t("sitedescription")}`;

  return {
    title: `${page.title} | ${t("sitename")}`,
    description: description,
    openGraph: {
      title: `${page.title} | ${t("sitename")}`,
      description: description,
      images: [{ url: imageUrl }]
    }
  };
}

const getPage = async (slug: string): Promise<Page> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/page/${slug}`;
  const page = await fetchData(API_URL, endpoint);
  return page;
};

export default async function Page({
  params: { locale, slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const page = await getPage(slug);

  const image1 = page.images && page.images.length > 0 ? page.images[0] : null;
  const image2 = page.images && page.images.length > 1 ? page.images[1] : null;
  const image3 = page.images && page.images.length > 2 ? page.images[2] : null;
  const image4 = page.images && page.images.length > 3 ? page.images[3] : null;
  const image5 = page.images && page.images.length > 4 ? page.images[4] : null;

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8 py-10">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:col-span-2 xl:col-auto">
            {page.title}
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <div dangerouslySetInnerHTML={{ __html: page.content }} className="text-lg leading-8" />
            </div>
            {page.image && (
              <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 " key={page.title}>
                <img src={page.image} className="object-cover w-full rounded-2xl border-b-8 border-[hsl(var(--citrus-lemon))]" />
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 sm:h-32" />
      </div>
    
      <Container className="p-10">
        {page.images && page.images.length > 0 && (
        <div className="mt-8">
          <GlobalCarousel 
            images={page.images} 
            navigationEnabled={false} 
            className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent md:rounded-3xl" 
          />
        </div>
        )}
      </Container>
    </>
  );
}
