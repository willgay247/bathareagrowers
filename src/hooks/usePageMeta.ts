import { useEffect } from 'react';

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === 'Bath Area Growers' ? title : `${title} | Bath Area Growers`;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', document.title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', document.title);
    setMeta('name', 'twitter:description', description);
  }, [title, description]);
}
