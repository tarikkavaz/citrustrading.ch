import { Page, ContentImage, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Image from "next/image";
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
      <div className="relative isolate">
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {page.title}
                </h1>
                <div dangerouslySetInnerHTML={{ __html: page.content }} className="relative mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none" />
              </div>
              <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    {image1 && (
                      <>
                        <Image
                          src={image1.image}
                          width={500}
                          height={300}
                          alt={image1.alt_text}
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <img src="{image1.image}" className="hidden" />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    {image2 && (
                      <>
                        <Image
                          src={image2.image}
                          width={500}
                          height={300}
                          alt={image2.alt_text}
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <img src="{image2.image}" className="hidden" />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    {image3 && (
                      <>
                        <Image
                          src={image3.image}
                          width={500}
                          height={300}
                          alt={image3.alt_text}
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <img src="{image3.image}" className="hidden" />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div className="relative">
                    {image4 && (
                      <>
                        <Image
                          src={image4.image}
                          width={500}
                          height={300}
                          alt={image4.alt_text}
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <img src="{image4.image}" className="hidden" />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                  {image5 && (
                      <>
                        <Image
                          src={image5.image}
                          width={500}
                          height={300}
                          alt={image5.alt_text}
                          className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                        />
                        <img src="{image5.image}" className="hidden" />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container className="">
        {page.image && (
          <div className="my-10 relative w-full h-[500px]">
            <Image
              src={page.image}
              priority={true}
              fill={true}
              alt={page.title}
              className="object-cover md:rounded-3xl"
            />
            <img src={page.image} className="hidden" />
          </div>
        )}
      </Container>
    </>
  );
}
