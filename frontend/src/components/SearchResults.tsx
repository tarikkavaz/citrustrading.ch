"use client";
import React, { useState } from 'react';
import { fetchData, SERVER_IP } from "@/utils/api";
import Link from 'next/link';
import { SearchResult, Product, Category } from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchResults = () => {
  const t = useTranslations('Globals');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const currentLocale = useLocale();

  const handleSearch = async () => {
    if (query.length === 0) return;
    const productsResponse = await fetchData(SERVER_IP, `/api/products?search=${query}`);
    const categoriesResponse = await fetchData(SERVER_IP, `/api/categories?search=${query}`);
    
    const filteredProducts = productsResponse.filter((product: Product) => product.lang === currentLocale);
    const filteredCategories = categoriesResponse.filter((category: Category) => category.lang === currentLocale);
  
    setResults([...filteredProducts, ...filteredCategories].map(item => ({
      title: item.title,
      snippet: item.pageinfo || item.categoryinfo,
      type: item.pageinfo ? 'Product' : 'Category',
      link: item.slug,
      locale: item.lang
    })));
    setSearchPerformed(true);
  };

  const highlightQueryInSnippet = (snippet: string, query: string): React.ReactNode => {
    if (!query) return snippet;
  
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = snippet.split(regex);
  
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? <span className='font-bold underline' key={index}>{part}</span> : part
    );
  };
  return (
    <>
      <hr />
      <Container className='mt-4'>
        <label htmlFor="search" className="block mb-5">
          <h4 className='max-w-2xl text-2xl font-bold tracking-tight lg:col-span-2 xl:col-auto mb-5 w-fit after:bg-slate-400 after:h-1'>{t("quicksearch")}</h4>
        </label>
        <div className="relative mt-2 flex items-center gap-2">
          <div className="relative w-full">
            <Input
              type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              name="search"
              id="search"
              className='rounded-xl block w-full'
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                ↵ Enter
              </kbd>
            </div>
          </div>
          <Button className='ml-2' onClick={handleSearch}>{t("search")}</Button>
        </div>
      </Container>
      <Container>
        {searchPerformed && results.length === 0 ? (
          <div className="mt-4 text-sm font-semibold">
            {t("noresult")}
          </div>
        ) : (
          <>
            {results.length > 0 && <h4 className='max-w-2xl text-xl font-bold tracking-tight lg:col-span-2 xl:col-auto mt-10 w-fit after:bg-slate-400 after:h-1'>{t("result")}</h4>}
            <ul className='mt-5'>
              {results.map((result, index) => (
                <>
                  <li key={index} className={`${result.type === 'Product' ? 'bg-[hsl(var(--citrus-lemon))]/30  hover:bg-[hsl(var(--citrus-lemon))]/40' : 'bg-[hsl(var(--citrus-orange))]/30 hover:bg-[hsl(var(--citrus-orange))]/40'} mb-4 p-3 rounded-2xl`}>
                    <Link href={`/${result.type.toLowerCase()}/${result.link}`} className='w-full'>
                      <h3 className='text-xl'>{result.title}</h3>
                      <h4 className='text-sm'>{highlightQueryInSnippet(result.snippet, query)}</h4>
                    </Link>
                  </li>
                </>
              ))}
            </ul>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
