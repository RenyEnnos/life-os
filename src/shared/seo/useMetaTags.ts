import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface RouteMeta {
  titleKey: string;
  descriptionKey: string;
  ogImage?: string;
  noIndex?: boolean;
}

const routeMetaMap: Record<string, RouteMeta> = {
  '/': {
    titleKey: 'seo.home.title',
    descriptionKey: 'seo.home.description',
    ogImage: '/og-home.png',
  },
  '/tasks': {
    titleKey: 'seo.tasks.title',
    descriptionKey: 'seo.tasks.description',
    ogImage: '/og-tasks.png',
  },
  '/habits': {
    titleKey: 'seo.habits.title',
    descriptionKey: 'seo.habits.description',
    ogImage: '/og-habits.png',
  },
  '/journal': {
    titleKey: 'seo.journal.title',
    descriptionKey: 'seo.journal.description',
    ogImage: '/og-journal.png',
  },
  '/health': {
    titleKey: 'seo.health.title',
    descriptionKey: 'seo.health.description',
    ogImage: '/og-health.png',
  },
  '/finances': {
    titleKey: 'seo.finances.title',
    descriptionKey: 'seo.finances.description',
    ogImage: '/og-finances.png',
  },
  '/projects': {
    titleKey: 'seo.projects.title',
    descriptionKey: 'seo.projects.description',
    ogImage: '/og-projects.png',
  },
  '/calendar': {
    titleKey: 'seo.calendar.title',
    descriptionKey: 'seo.calendar.description',
    ogImage: '/og-calendar.png',
  },
  '/login': {
    titleKey: 'auth.login',
    descriptionKey: 'seo.defaultDescription',
    noIndex: true,
  },
  '/register': {
    titleKey: 'auth.register',
    descriptionKey: 'seo.defaultDescription',
    noIndex: true,
  },
  '/settings': {
    titleKey: 'settings.title',
    descriptionKey: 'seo.defaultDescription',
    noIndex: true,
  },
};

export function useMetaTags(customMeta?: Partial<RouteMeta>) {
  const location = useLocation();
  const { t } = useTranslation();
  
  const meta = useMemo(() => {
    const routeConfig = routeMetaMap[location.pathname] || {
      titleKey: 'seo.defaultTitle',
      descriptionKey: 'seo.defaultDescription',
    };
    
    return {
      ...routeConfig,
      ...customMeta,
    };
  }, [location.pathname, customMeta]);
  
  return {
    title: t(meta.titleKey),
    description: t(meta.descriptionKey),
    path: location.pathname,
    ogImage: meta.ogImage || '/og-image.png',
    noIndex: meta.noIndex || false,
  };
}
