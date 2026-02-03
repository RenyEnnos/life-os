import { MetaTags } from './MetaTags';
import { useMetaTags } from './useMetaTags';
import { ReactNode } from 'react';

interface SEOWrapperProps {
  children: ReactNode;
}

export function SEOWrapper({ children }: SEOWrapperProps) {
  const meta = useMetaTags();
  
  return (
    <>
      <MetaTags
        title={meta.title}
        description={meta.description}
        path={meta.path}
        ogImage={meta.ogImage}
        noIndex={meta.noIndex}
      />
      {children}
    </>
  );
}
