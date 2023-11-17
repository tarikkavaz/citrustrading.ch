import { Product, MetadataProps } from "@/utils/types";
import Container from "@/components/ui/Container";
import Link from "next/link";
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
    <Container size="fluid" className="mt-16">
      <Container className="py-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl w-fit border-solid  
        border-b-8 border-[hsl(var(--citrus-lemon))]">{t("products")}</h1>
        <div className="grid md:grid-cols-4 gap-10 mt-8">
          {products.map((product) => (
            <div key={product.id} className="group relative rounded-2xl bg-[hsl(var(--citrus-lemon))]/30 hover:bg-[hsl(var(--citrus-lemon))]/40 border hover:border-[hsl(var(--citrus-lemon))]">
            <div className="h-56 w-full overflow-hidden rounded-2xl lg:h-72 xl:h-80">
              <div className="h-full w-full object-cover object-center">
                <img src={product.image ? product.image : '/images/placeholder.jpg'} className="h-full w-full object-cover object-center border-b-8 border-[hsl(var(--citrus-lemon))]" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="mt-4 text-xl">
                <Link href={`/product/${product.slug}`}>
                  <span className="absolute inset-0" />
                  {product.title}
                </Link>
              </h3>
              <h4 className="min-h-[3.5rem] text-sm">{product.pageinfo}</h4>
            </div>
            
          </div>
          ))}
        </div>
      </Container>
    </Container>
  );
}
