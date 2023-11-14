import {
  Homepage,
  MetadataProps,
  HomeProps,
  ContentImage,
  Category
} from "@/utils/types";
import Container from "@/components/ui/Container";
import { GlobalCarousel } from "@/components/animation/GlobalCarousel";
import Link from "next/link";
import Image from "next/image";
import { fetchData, API_URL, SERVER_IP } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/config";
import { Metadata, ResolvingMetadata } from "next";


const getHomepage = async (): Promise<Homepage[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/homepage/`;
  const products = await fetchData(API_URL, endpoint);
  return products;
};

const getCategories = async (locale: string): Promise<Category[]> => {
  const categoriesEndpoint = `/api/categories/`;
  const allCategories: Category[] = await fetchData(API_URL, categoriesEndpoint);
  return allCategories.filter(category => category.lang === locale);
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
  const categories = await getCategories(locale);
  const homepage = products[0];
  const t = await getTranslator(locale, "Globals");

  return (
    <>
      <Container className="px-10 mt-16" id="content">
      {homepage.images && homepage.images.length > 0 && (
      <Container size="fluid" className="">
        <GlobalCarousel 
          images={homepage.images || []} 
          className="h-[200px] md:h-[300px] lg:h-[450px] bg-accent" 
        />
      </Container>
      )}
        {/* <div className="grid md:grid-cols-3 gap-4 mt-8">
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
        </div> */}
        <h1>{homepage.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: homepage.content }} />
      </Container>
      {homepage.products && homepage.products.length > 0 && (
      <Container>
        <hr className="h-0.5 my-3 bg-accent" />
        <h2>{t("featuredproducts")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {homepage.products.map((product) => (
            <div key={product.id}>
              <Link href={`/product/${product.slug}`}>
                <div>
                  <div>{product.title}</div>
                  
                </div>
                <div>
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={product.image ? product.image : "/images/placeholder.jpg"}
                      priority={true}
                      fill={true}
                      sizes="100%"
                      alt={product.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>{product.pageinfo}</div>
              </Link>
              <img src={product.image ? product.image : '/images/placeholder.jpg'} className="hidden" />
            </div>
          ))}
        </div>
      </Container>
    )}

      <Container>
        <hr className="h-0.5 my-3 bg-accent mt-12 " />
        <h2>{t("categories")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id}>
              <Link href={`/${locale}/category/${category.slug}`}>
                <div>
                  <div>{category.title}</div>
                </div>
                <div>
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={category.image ? category.image : "/images/placeholder.jpg"}
                      priority={true}
                      fill={true}
                      sizes="100%"
                      alt={category.title}
                      className="object-cover"
                    />
                    <img src={category.image ? category.image : '/images/placeholder.jpg'} className="hidden" />
                  </div>
                </div>
                <div>{category.categoryinfo}</div>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
