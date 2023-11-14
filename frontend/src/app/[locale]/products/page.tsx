import { Product, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from 'next/image';
import { fetchData, API_URL } from "@/utils/api";
import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { DEFAULT_OG_IMAGE_URL } from '@/lib/config';

const getProducts = async (): Promise<Product[]> => {
  const locale = useLocale();
  const endpoint = `/api/${locale}/products/`;
  const products = await fetchData(API_URL, endpoint);

  return products;
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

export default async function Products({ params: { locale } }: MetadataProps) {
  const products = await getProducts();
  const t = await getTranslator(locale, "Globals");
  return (
    <Container className="mt-16">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{t("products")}</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {products.map((product) => (
          <div key={product.id} className="group relative">
          <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
            <div className="h-full w-full object-cover object-center">
              <Image
              src={product.image ? product.image : "/images/placeholder.jpg"}
              className="h-full w-full object-cover object-center"
              alt={product.title}
              sizes="100%"
              width={500}
              height={400}
              />
            </div>
          </div>
          <h3 className="mt-4 text-gray-700 text-xl">
            <Link href={`/product/${product.slug}`}>
              <span className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>
          <h4 className="min-h-[3.5rem] text-sm">{product.pageinfo}</h4>
          <img src={product.image ? product.image : '/images/placeholder.jpg'} className="hidden" />
        </div>
        ))}
      </div>
    </Container>
  );
}
