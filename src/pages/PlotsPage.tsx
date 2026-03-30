const SPACES = [
  { name: "Foxhill Community Garden, Combe Down", description: "A lovely square of land just around the corner from Bradford Road shops, maintained as a community garden till 2020. It has a shed, water butt, and small cherry tree. With some weeding it could be returned to a beautiful, productive space for reflection and connection. Contact info@bathareagrowers for more information." },
  { name: "Gravel Walk Community Garden, City Centre", description: "Just off Queens Parade Place, this is the first plot on the right of Gravel Walk. Many years ago it was turned into a small fruit and vegetable garden by guerilla gardeners. Now overgrown, it would make a great spot for some local residents or workers to perhaps meet in their lunch hour to garden together." },
  { name: "Hanna Close Community Garden, Twerton", description: "This quiet patch is nestled next to a footpath near Twerton Park football ground. It is a space for the local community, where anyone passing by or living in the local area can get involved or help themselves to the odd raspberry, blackcurrant or globe artichoke. The garden is getting a little overgrown and is looking for new people to take care and restore her." },
];

const OTHER_ALLOTMENTS = [
  "For Bathampton allotments apply to Bathampton Parish Council.",
  "For Bathford allotments contact Bathford Parish Council.",
  "For Southstoke Park allotments apply to Southstoke Parish Council.",
  "For Bath City Farm allotments in Twerton contact Bath City Farm.",
];

const PlotsPage = () => (
  <main>
    <section
      className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/1-1-rotated.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Plots and Land Available</h1>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-[32px] font-bold text-foreground mb-10">Available community spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPACES.map((s) => (
            <div key={s.name}>
              <h3 className="text-[22px] font-bold text-foreground">{s.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="w-full bg-background-inverse py-[60px] px-4">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[32px] font-bold text-foreground-alt mb-4">Council Allotments</h2>
        <p className="text-[18px] leading-relaxed text-foreground-alt mb-12">
          Apply to B&NES council for an allotment at one of their 24 allotments sites in Bath.
        </p>
        <h2 className="text-[32px] font-bold text-foreground-alt mb-4">Other Allotments</h2>
        <ul className="list-disc pl-6 space-y-2">
          {OTHER_ALLOTMENTS.map((item) => (
            <li key={item} className="text-[18px] text-foreground-alt">{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[32px] font-bold text-foreground mb-4">Neighbourhood Nature Areas</h2>
        <p className="text-[18px] leading-relaxed text-foreground">
          B&NES council have a system where you can apply to manage small areas of council land, such as road verges and small open spaces, if you want to garden them for ecological benefit and wildlife. This could include some food plants. Use their online map to identify if the land is managed by the Parks team, then email parks@bathnes.gov.uk to check if it is suitable to be gardened and get agreement.
        </p>
      </div>
    </section>
  </main>
);

export default PlotsPage;
