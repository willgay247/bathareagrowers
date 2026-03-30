const PlaceholderPage = ({ title }: { title: string }) => (
  <main className="flex min-h-[60vh] items-center justify-center px-4">
    <h1 className="text-[32px] font-bold text-foreground text-center">{title}</h1>
  </main>
);

export default PlaceholderPage;
