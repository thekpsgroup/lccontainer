export type CitySlug = "dallas" | "fort-worth" | "austin" | "houston" | "san-antonio" | "waco" | "tyler";
export interface CityInfo {
  slug: CitySlug;
  name: string;
  metro: string;
  zipHint: string;         // helpful example
  blurb: string;
  distanceNote: string;    // relative to Hutchins yard
  neighborhoods: string[]; // for credibility + long-tail
}

export const CITIES: CityInfo[] = [
  {
    slug: "dallas",
    name: "Dallas",
    metro: "Dallas–Fort Worth",
    zipHint: "75201",
    blurb: "Fast delivery from our Hutchins yard. New & used containers for storage, construction, and custom builds.",
    distanceNote: "~15–30 miles from yard; same-week delivery typical.",
    neighborhoods: ["Downtown", "Oak Lawn", "Lake Highlands", "Pleasant Grove", "North Dallas"],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    metro: "Dallas–Fort Worth",
    zipHint: "76102",
    blurb: "20' & 40' containers—Standard and High Cube—delivered to job sites and yards across Tarrant County.",
    distanceNote: "~35–50 miles from yard; allow 1–3 business days.",
    neighborhoods: ["Downtown", "Arlington Heights", "Near Southside", "Alliance", "Benbrook"],
  },
  {
    slug: "austin",
    name: "Austin",
    metro: "Austin–Round Rock",
    zipHint: "78701",
    blurb: "Reliable storage and project builds for Central Texas—WWT used and one-trip new.",
    distanceNote: "~180–200 miles; schedule 2–5 business days.",
    neighborhoods: ["Downtown", "South Austin", "East Austin", "Round Rock", "Cedar Park"],
  },
  {
    slug: "houston",
    name: "Houston",
    metro: "Houston–The Woodlands–Sugar Land",
    zipHint: "77002",
    blurb: "From laydown yard storage to retail mods—we deliver across Greater Houston.",
    distanceNote: "~240–260 miles; schedule 3–5 business days.",
    neighborhoods: ["Downtown", "Heights", "East End", "Sugar Land", "The Woodlands"],
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    metro: "San Antonio–New Braunfels",
    zipHint: "78205",
    blurb: "Containers for remodels, events, and long-term storage with transparent delivery.",
    distanceNote: "~270–300 miles; schedule 3–5 business days.",
    neighborhoods: ["Downtown", "Alamo Heights", "Stone Oak", "Southside", "New Braunfels"],
  },
  {
    slug: "waco",
    name: "Waco",
    metro: "Waco",
    zipHint: "76701",
    blurb: "Quick container delivery for Central Texas projects—budget used or clean one-trip.",
    distanceNote: "~100 miles; usually 1–3 business days.",
    neighborhoods: ["Downtown", "Bellmead", "Woodway", "Hewitt", "Robinson"],
  },
  {
    slug: "tyler",
    name: "Tyler",
    metro: "Tyler",
    zipHint: "75701",
    blurb: "Storage and site containers delivered across East Texas—ask about High Cubes.",
    distanceNote: "~100–115 miles; usually 1–3 business days.",
    neighborhoods: ["Downtown", "Azalea District", "Flint", "Whitehouse", "Lindale"],
  },
];
