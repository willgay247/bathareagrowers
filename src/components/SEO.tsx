import { usePageMeta } from '@/hooks/usePageMeta';

interface SEOProps {
  title: string;
  description: string;
}

export function SEO({ title, description }: SEOProps) {
  usePageMeta(title, description);
  return null;
}
