export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  organiser: string;
  tags: string[];
  image: string;
  description: string;
}

export const events: Event[] = [
  { slug: "growing-our-local-food-system", title: "Growing Our Local Food System", date: "6th October 2024", time: "10:00 am – 4:30 pm", location: "St Mark's Community Centre", address: "St Mark's Road, Widcombe, Bath, BA2 4PA", organiser: "Bath Area Growers", tags: ["community", "food", "growing", "local", "regenerative"], image: "https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/cms-images/2_20240729_214914_0001.png", description: "A community gathering organised by Bath Area Growers, on Sunday 6th October at St Mark's Community Centre, Widcombe. A day of visioning what a re-localised, nature-regenerating, inclusive food growing culture could look and feel like in Bath. Come to explore, share, discuss, and plan next steps. There will be speakers, workshops, reflection, song, creativity and delicious food! All welcome: community growers, allotmenteers, farmers, affordable food volunteers and customers, policy makers, activists, community organisers and anyone who buys, cooks or eats food!" },
  { slug: "community-seed-saving", title: "Community Seed Saving", date: "June 2024", time: "TBC", location: "Bath", address: "Bath, BA1", organiser: "Bath Area Growers", tags: ["growing"], image: "", description: "A community seed saving event for Bath Area Growers network members." },
  { slug: "first-aid-training", title: "First Aid Training", date: "July 2024", time: "TBC", location: "Bath", address: "Bath", organiser: "Bath Area Growers", tags: ["community"], image: "", description: "First aid training session for community garden volunteers." },
  { slug: "pizza-party", title: "Pizza Party", date: "July 2024", time: "TBC", location: "Roundhouse and Pizza Area", address: "Bath", organiser: "Bath Area Growers", tags: ["community", "food"], image: "", description: "A community pizza party at the roundhouse." },
  { slug: "network-strategy-meeting", title: "Network Strategy Meeting", date: "July 2024", time: "TBC", location: "Bath", address: "Bath", organiser: "Bath Area Growers", tags: ["community"], image: "", description: "Bath Area Growers network strategy meeting." },
  { slug: "alice-park-community-garden-tour", title: "Alice Park Community Garden Tour", date: "June 2024", time: "TBC", location: "Alice Park, Larkhall", address: "Alice Park, Larkhall, Bath", organiser: "Bath Area Growers", tags: ["community", "growing"], image: "", description: "A tour of Alice Park Community Garden in Larkhall, Bath." },
  { slug: "batheaston-forest-garden-open-day", title: "Batheaston Forest Garden Open Day", date: "June 2024", time: "TBC", location: "Batheaston Forest Garden", address: "Batheaston, Bath", organiser: "Bath Area Growers", tags: ["growing"], image: "", description: "Open day at the Batheaston Forest Garden." },
  { slug: "tours-tea-and-chat-with-bath-organic-group", title: "Tours, Tea and Chat with Bath Organic Group", date: "June 2024", time: "TBC", location: "Victoria Park, Bath", address: "Royal Victoria Park, Bath", organiser: "Bath Area Growers", tags: ["community"], image: "", description: "Tours, tea and chat with Bath Organic Group at Victoria Park." },
  { slug: "a-community-of-hedges-with-blooming-whiteway", title: "A Community of Hedges with Blooming Whiteway", date: "June 2024", time: "TBC", location: "Whiteway, Bath", address: "Whiteway, Bath", organiser: "Bath Area Growers", tags: ["growing", "community"], image: "", description: "A community hedge planting event with Blooming Whiteway." },
  { slug: "growing-green-open-day", title: "Growing Green Open Day", date: "May 2024", time: "TBC", location: "Bath", address: "Bath", organiser: "Bath Area Growers", tags: ["growing"], image: "", description: "Open day for the Growing Green project." },
  { slug: "greenlinks-plant-sale", title: "Greenlinks Plant Sale", date: "May 2024", time: "TBC", location: "Monksdale Road, Oldfield Park", address: "Monksdale Road, Oldfield Park, Bath", organiser: "Bath Area Growers", tags: ["community"], image: "", description: "Plant sale at the Greenlinks allotment on Monksdale Road." },
];
