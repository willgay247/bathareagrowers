export interface Location {
  slug: string;
  name: string;
  area: string;
  address: string;
  description: string;
  image: string;
  upcomingEvents: string[];
}

export const locations: Location[] = [
  { slug: "alice-park-community-garden", name: "Alice Park Community Garden", area: "Larkhall, Bath", address: "Alice Park, Larkhall, Bath", description: "Managed and gardened by volunteers, sharing skills and knowledge, Alice Park Community Garden in Larkhall aims to model community resilience and food self-sufficiency. It's also a social hub where local community members can gather.", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3660-e1718389959542.jpeg", upcomingEvents: [] },
  { slug: "alice-park-community-garden-2", name: "Alice Park Community Garden", area: "Larkhall, Bath", address: "Alice Park, Larkhall, Bath", description: "Community garden at Alice Park.", image: "", upcomingEvents: [] },
  { slug: "bath-organic-group", name: "Bath Organic Group", area: "Victoria Park, Bath", address: "Royal Victoria Park, Bath", description: "'BOG' is a large community garden in Victoria Park allotments, established for over 20 years, spearheading organic growing in the area.", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3652.jpeg", upcomingEvents: [] },
  { slug: "batheaston-forest-garden", name: "Batheaston Forest Garden", area: "Batheaston, Bath", address: "Batheaston, Bath", description: "Created lovingly by volunteers since 2021, the forest garden is full of food plants such as apple, pear, hazelnut and cherry trees, blackcurrants, herbs and perennial vegetables.", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3668-e1718391554561-1024x926.jpeg", upcomingEvents: [] },
  { slug: "damson-farm", name: "Damson Farm", area: "Bath area", address: "Bath area", description: "Damson Farm – a local growing site.", image: "", upcomingEvents: [] },
  { slug: "haycombe-drive", name: "Haycombe Drive", area: "Bath", address: "Haycombe Drive, Bath", description: "Growing site at Haycombe Drive.", image: "", upcomingEvents: [] },
  { slug: "monksdale-allotments", name: "Monksdale Allotments", area: "Oldfield Park, Bath", address: "Monksdale Road, Oldfield Park, Bath", description: "Monksdale Road allotments in Oldfield Park, home to Greenlinks.", image: "", upcomingEvents: [] },
  { slug: "roundhouse-and-pizza-area", name: "Roundhouse and Pizza Area", area: "Bath", address: "Bath", description: "The roundhouse and pizza area – a community gathering space.", image: "", upcomingEvents: [] },
  { slug: "st-marks-community-centre", name: "St Mark's Community Centre", area: "Widcombe, Bath", address: "St Mark's Road, Widcombe, Bath, BA2 4PA", description: "A lovely hall with a wooden floor in a converted church, used for community events.", image: "", upcomingEvents: ["growing-our-local-food-system"] },
  { slug: "weston-spring-farm", name: "Weston Spring Farm", area: "Weston, Bath", address: "Weston, Bath", description: "Home of Middle Ground Growers' market garden and Regenerators Course.", image: "", upcomingEvents: [] },
  { slug: "where-forest-garden-next-to-secret-garden", name: "Forest Garden next to Secret Garden", area: "Batheaston, Bath", address: "Batheaston, Bath", description: "The forest garden by the riverside carpark and Secret Garden in Batheaston.", image: "", upcomingEvents: [] },
];
