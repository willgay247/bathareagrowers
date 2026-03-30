const PlaceholderPage = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <h1 className="text-[32px] font-bold text-foreground">{title}</h1>
    {subtitle && <p className="mt-4 max-w-[600px] text-[18px] leading-relaxed text-foreground">{subtitle}</p>}
  </main>
);

export default PlaceholderPage;
