import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  defaultLocale: "en",
  locales: ["en", "tr"],
  pathnames: {
    "/home": {
      en: "/home",
      tr: "/anasayfa",
    },

    "/products": {
      en: "/products",
      tr: "/urunler",
    },
    "/product/[slug]": {
      en: "/product/[slug]",
      tr: "/urun/[slug]",
    },
    
    "/pages": {
      en: "/pages",
      tr: "/sayfalar",
    },
    "/page/[slug]": {
      en: "/page/[slug]",
      tr: "/sayfa/[slug]",
    },

    "/tag": {
      en: "/tag",
      tr: "/etiket",
    },
    "/tag/[slug]": { 
      en: "/tag/[slug]",
      tr: "/etiket/[slug]",
    },

    "/categories": {
      en: "/categories",
      tr: "/kategoriler",
    },
    "/category/[slug]": {
      en: "/category/[slug]",
      tr: "/kategori/[slug]",
    },
  },
  localePrefix: "always",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
