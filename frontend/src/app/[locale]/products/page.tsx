import { Product, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
import Image from 'next/image';
import { fetchData, API_URL } from "@/utils/api";  // Imported API_URL
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
    <>
      <Container className="p-10 mt-16">
        <h1>{t("products")}</h1>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {products.map((product) => (
              <>
                <div key={product.id}>
                <Link href={`/product/${product.slug}`}>
                  <div>
                    <h2>{product.title}</h2>
                  </div>
                  <div>
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={product.image ? product.image : "/placeholder.jpg"}
                        priority={true}
                        fill={true}
                        alt={product.title}
                        className=" object-cover"
                      />
                      <img src={product.image ? product.image : '/images/placeholder.jpg'} className="hidden" />
                    </div>
                  </div>
                  <h3 className="min-h-[3.5rem]">{product.pageinfo}</h3>
                  </Link>
                </div>
              </>
          ))}
        </div>
      </Container>
    </>
  );
}
