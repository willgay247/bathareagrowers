import { usePageMeta } from '@/hooks/usePageMeta';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  usePageMeta(title, description, { image, url });
  return null;
}
