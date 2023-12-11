import { Page, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import {FadeIn, FadeInStagger} from "@/components/animation/FadeIn";
import {SlideIn, SlideInStagger} from "@/components/animation/SlideIn";

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
                    {page.title} <br className="hidden lg:inline" />
                    </h1>
                  </FadeIn>
                  <FadeIn className="hidden">
                    <p className="mt-6 text-3xl">
                      {page.pageinfo}
                    </p>
                  </FadeIn>
                  <FadeIn>
                    <div dangerouslySetInnerHTML={{ __html: page.content }}  className="mt-6 text-lg leading-8" />
                  </FadeIn>
                </FadeInStagger>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full">
            {page?.image ? (
              <GlobalCarousel
                images={page.images || []} 
                className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full rounded-2xl md:rounded-none md:rounded-bl-[150px]" 
              />
            ) : (
              <img src="/images/placeholder.jpg" alt="Placeholder" className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full rounded-2xl md:rounded-none md:rounded-bl-[150px]" />
            )}
            </div>
          </div>
        </div>
      </Container>
      <Container size="fluid" className="mt-16 md:mt-[7.5rem] hidden">
        <div className="relative isolate overflow-hidden">
          <div className="max-w-screen-xl mx-auto pt-10">
            <FadeInStagger>
              <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                <div className="max-w-2xl lg:col-span-2 xl:col-auto">
                  <FadeIn>
                    <h1 className="w-fit text-4xl font-bold tracking-tight sm:text-6xl after:bg-gray-400">
                      {page.title}
                    </h1>
                  </FadeIn>
                </div>
                <FadeIn className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                  <div className="text-lg leading-8">
                  {page?.pageinfo}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: page?.content || '' }} className="text-lg leading-8" />
                </FadeIn>
                <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2">
                  {page?.image ? (
                    <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2" key={page?.title}>
                      <img src={page?.image} className="rounded-2xl w-full object-cover border-b-8 border-[hsl(var(--citrus-lemon))]" />
                    </div>
                  ) : (
                    <div className="my-10 relative mt-10 w-full max-w-lg sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2"> 
                    <img src="/images/placeholder.jpg" alt="Placeholder" className="rounded-2xl w-full object-cover border-b-8 border-[hsl(var(--citrus-lemon))]"/>
                    </div>
                  )}
                </div>
              </div>
            </FadeInStagger>
          </div>
        </div>
      </Container>
    
      <Container size="fluid" className="md:mt-16">
        {page.images && page.images.length > 0 && (
        <div className="relative isolate overflow-hidden">
          <div className="max-w-screen-xl mx-auto md:pt-10">
            <GlobalCarousel 
              images={page.images || []} 
              navigationEnabled={false} 
              className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent rounded-2xl" 
            />
          </div>
        </div>
        )}
      </Container>
    </>
  );
}
