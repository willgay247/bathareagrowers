const GRANTS = [
  { name: "Avon Gardens Trust", description: "offering grants for community groups to develop their communal spaces" },
  { name: "Defra Community Green Spaces Fund", description: "a new grants scheme coming soon for community growing" },
  { name: "BWCE Community Energy Fund", description: "surplus income from BWCE renewable energy generating projects provides grants to local community projects that aim to reduce carbon emissions and alleviate fuel poverty." },
  { name: "National Garden Scheme Community Garden grants", description: "The application process for 2025 will open in the autumn 2024. Full details of how to apply will be published later in the year." },
  { name: "Natoora Farm Fund", description: "Grants are open to farmers who are 35 and under in the USA, UK and Europe, committed to agroecological cultivation methods." },
];

const ORGS = [
  { name: "Social Farms and Gardens", description: "a UK wide charity representing and supporting community gardens and social farms" },
  { name: "Permaculture Association", description: "promoting permaculture ethics and design principles to create healthy cultures and ecosystems" },
  { name: "Landworkers' Alliance", description: "a union of farmers, growers, foresters and land-based workers" },
  { name: "National Forest Gardening Scheme", description: "A community of forest gardeners with a Loomio forum to ask questions, share knowledge and experience." },
];

const CardList = ({ items }: { items: { name: string; description: string }[] }) => (
  <div className="flex flex-col gap-4">
    {items.map((item) => (
      <div key={item.name} className="border-b border-foreground/10 pb-4">
        <h3 className="text-[18px] font-bold">{item.name}</h3>
        <p className="mt-1 text-[15px] leading-relaxed text-foreground">{item.description}</p>
      </div>
    ))}
  </div>
);

const GrantsPage = () => (
  <main>
    <section className="flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-background px-4">
      <h1 className="text-center text-[28px] font-bold text-foreground md:text-[48px]">Grants and National Organisations</h1>
    </section>

    <section className="w-full bg-accent py-10 px-4">
      <p className="mx-auto max-w-[800px] text-center text-[18px] italic text-foreground-alt">
        Let us know of any other relevant grants you are aware of so we can add them to this resource
      </p>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[32px] font-bold mb-8">Grants</h2>
        <CardList items={GRANTS} />

        <h2 className="text-[32px] font-bold mt-16 mb-8">National Organisations</h2>
        <CardList items={ORGS} />
      </div>
    </section>
  </main>
);

export default GrantsPage;
