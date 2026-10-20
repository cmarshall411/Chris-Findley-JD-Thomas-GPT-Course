// Placeholder catalog for the clickable mock. Titles and availability are made up.

export const SERVICES = ["Streamly", "FlixBox", "Cinemax+", "PrimeView", "HueTV"] as const;
export type Service = (typeof SERVICES)[number];

export const MOODS = ["Feel-good", "Thrilling", "Thoughtful", "Funny", "Scary"] as const;
export type Mood = (typeof MOODS)[number];

export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: number; // minutes
  genre: string;
  moods: Mood[];
  services: Service[];
  synopsis: string;
};

export const MOVIES: Movie[] = [
  {
    id: "m1",
    title: "The Lighthouse Bakery",
    year: 2021,
    runtime: 98,
    genre: "Comedy",
    moods: ["Feel-good", "Funny"],
    services: ["Streamly", "HueTV"],
    synopsis: "A burned-out chef inherits a seaside bakery and a town that refuses to let it close.",
  },
  {
    id: "m2",
    title: "Signal Lost",
    year: 2019,
    runtime: 112,
    genre: "Thriller",
    moods: ["Thrilling"],
    services: ["FlixBox"],
    synopsis: "A radio operator on a remote station picks up a distress call from a ship that sank 40 years ago.",
  },
  {
    id: "m3",
    title: "Paper Planets",
    year: 2022,
    runtime: 124,
    genre: "Drama",
    moods: ["Thoughtful"],
    services: ["Cinemax+", "PrimeView"],
    synopsis: "Two estranged siblings rebuild their late father's backyard observatory over one summer.",
  },
  {
    id: "m4",
    title: "Night Shift at Hollow Pines",
    year: 2020,
    runtime: 89,
    genre: "Horror",
    moods: ["Scary", "Thrilling"],
    services: ["Streamly"],
    synopsis: "A new night nurse discovers the patients in Ward C haven't aged in decades.",
  },
  {
    id: "m5",
    title: "Office Olympics",
    year: 2018,
    runtime: 94,
    genre: "Comedy",
    moods: ["Funny"],
    services: ["FlixBox", "PrimeView"],
    synopsis: "Rival departments compete in an increasingly unhinged corporate team-building tournament.",
  },
  {
    id: "m6",
    title: "Midnight Express Lane",
    year: 2023,
    runtime: 131,
    genre: "Action",
    moods: ["Thrilling"],
    services: ["Cinemax+"],
    synopsis: "A getaway driver has one night to deliver a package across a city that wants it back.",
  },
  {
    id: "m7",
    title: "Sunday Gardens",
    year: 2017,
    runtime: 102,
    genre: "Romance",
    moods: ["Feel-good", "Thoughtful"],
    services: ["HueTV", "PrimeView"],
    synopsis: "Neighbors feuding over a community garden slowly realize they're on the same side.",
  },
  {
    id: "m8",
    title: "The Quiet Archive",
    year: 2021,
    runtime: 118,
    genre: "Mystery",
    moods: ["Thoughtful", "Thrilling"],
    services: ["Streamly", "FlixBox"],
    synopsis: "A librarian finds coded notes in returned books that point to an unsolved disappearance.",
  },
  {
    id: "m9",
    title: "Whiskers in Space",
    year: 2022,
    runtime: 86,
    genre: "Animation",
    moods: ["Feel-good", "Funny"],
    services: ["PrimeView", "Streamly"],
    synopsis: "A ship's cat accidentally takes command of an interstellar cargo freighter.",
  },
  {
    id: "m10",
    title: "Basement Tapes",
    year: 2019,
    runtime: 95,
    genre: "Horror",
    moods: ["Scary"],
    services: ["FlixBox", "HueTV"],
    synopsis: "Old VHS tapes found in a new house start showing footage of tomorrow.",
  },
  {
    id: "m11",
    title: "Long Road North",
    year: 2016,
    runtime: 141,
    genre: "Drama",
    moods: ["Thoughtful"],
    services: ["Streamly"],
    synopsis: "A retired trucker drives his granddaughter across the country to scatter her mother's ashes.",
  },
  {
    id: "m12",
    title: "Wedding Crashers Anonymous",
    year: 2024,
    runtime: 104,
    genre: "Comedy",
    moods: ["Funny", "Feel-good"],
    services: ["Cinemax+", "FlixBox"],
    synopsis: "A support group for reformed wedding crashers relapses spectacularly at one last ceremony.",
  },
];
