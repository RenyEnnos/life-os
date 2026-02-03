import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title?: string;
  description?: string;
  ogImage?: string;
  path?: string;
  noIndex?: boolean;
}

export function MetaTags({ 
  title, 
  description, 
  ogImage = '/og-image.png', 
  path = '',
  noIndex = false 
}: MetaTagsProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const siteUrl = 'https://life-os.app';
  const fullUrl = `${siteUrl}${path}`;
  const pageTitle = title ? `${title} | Life OS` : t('seo.defaultTitle');
  const pageDescription = description || t('seo.defaultDescription');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#000000" />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="pt-BR" href={`${siteUrl}${path}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${path}`} />
      <link rel="alternate" hrefLang="es" href={`${siteUrl}/es${path}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${path}`} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content="Life OS" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLang.replace('-', '_')} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Life OS" />
    </Helmet>
  );
}
