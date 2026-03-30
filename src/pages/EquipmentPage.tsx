const ITEMS = [
  "Fruit picker – Avon Gleaning Network",
  "Apple Press – Transition Bath",
  "Large apple press – Bath Organic Group, Victoria Park",
  "Charcoal burner – Bath Organic Group, Victoria Park",
  "Wheeled strimmer – Dry Arch, Bathampton",
  "Brush cutter – Dry Arch, Bathampton",
  "5ft wide diesel grass cutter (trailer needed) – Dry Arch, Bathampton",
  "Arborist kit if qualified – Dry Arch, Bathampton",
  "Broadfork – Undercliff Urban Farm, Bathwick",
  "Hand tools, 2 Wheelbarrows, 2 Gas stoves, 2 Folding tables – Alice Park Community Garden, Larkhall",
];

const LIBRARIES = [
  {
    name: "Borrow It",
    intro: "'Borrow it' is based at Timebank Plus on Twerton High Street. Items must be collected by the borrower. Sign-up at Timebank – bring photo ID – to become a member and to borrow – all for free.",
    sections: [
      { title: "Powered gardening equipment", items: "Plug-in Lawnmower, rotavator, battery/plug-in strimmers, plug-in hedge trimmers, dehydrator" },
      { title: "Hand tools", items: "Forks, spades, shovels, hoes, rakes, leaf rake, brooms, shears, bow saws, etc." },
      { title: "Events", items: "Large hot water urn, soup urn, gazebo, bunting, etc." },
    ],
  },
  {
    name: "Share and Repair",
    intro: "Share and Repair is on George Street, Bath city centre, with a bicycle delivery service or a loading bay outside the shop. There is a small fee per loan.",
    sections: [
      { title: "Powered gardening equipment", items: "Plug-in strimmers, cordless strimmers, hedge trimmers, cordless hedge trimmers, mowers, shredders, etc." },
      { title: "Hand gardening tools", items: "Aerator, scarifier, leaf/grass collector, spreader, spades, shears, loppers, axes, wheelbarrows, hoses, etc." },
      { title: "Events", items: "Portable grill, large cool box, floodlights, camping tables, bunting, giant jenga, boules, croquet, quoits" },
    ],
  },
];

const EquipmentPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3759.webp')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Equipment to Borrow</h1>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[32px] font-bold text-foreground mb-4">Item lending between community projects</h2>
        <p className="text-[18px] leading-relaxed text-foreground mb-8">
          Some BAGs member projects have useful equipment for gardening and events that they are willing to lend out to other community projects. This is at the discretion of each project and by individual arrangement between groups.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          {ITEMS.map((item) => (
            <li key={item} className="text-[18px] text-foreground">{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="w-full bg-background-inverse py-[60px] px-4">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-[32px] font-bold text-foreground-alt mb-4">Libraries of Things</h2>
        <p className="text-[18px] leading-relaxed text-foreground-alt mb-10">
          Bath has two 'libraries of things'. Below is a list of gardening and events items held by each library, compiled July 2024.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LIBRARIES.map((lib) => (
            <div key={lib.name} className="rounded-md bg-white/10 p-6">
              <h3 className="text-[22px] font-bold text-foreground-alt mb-3">{lib.name}</h3>
              <p className="text-[15px] leading-relaxed text-foreground-alt mb-4">{lib.intro}</p>
              {lib.sections.map((s) => (
                <div key={s.title} className="mb-3">
                  <h4 className="text-[15px] font-bold text-foreground-alt">{s.title}</h4>
                  <p className="text-[14px] leading-relaxed text-foreground-alt/80">{s.items}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default EquipmentPage;
