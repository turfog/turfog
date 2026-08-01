import type { Sport } from "@/types";

export const SPORTS: Sport[] = [
  {
    id: "football",
    name: "Football",
    tagline: "5v5, 6v6, 7v7 on turf",
    formats: ["5v5", "6v6", "7v7"],
    heroImage: "/images/sports/football-hero.jpg",
  },
  {
    id: "box-cricket",
    name: "Box cricket",
    tagline: "Tennis ball, night cricket, corporate leagues",
    formats: ["Tennis ball", "Hard ball", "Corporate"],
    heroImage: "/images/sports/box-cricket-hero.jpg",
  },
  {
    id: "pickleball",
    name: "Pickleball",
    tagline: "Singles, doubles, beginner friendly",
    formats: ["Singles", "Doubles", "Coaching"],
    heroImage: "/images/sports/pickleball-hero.jpg",
  },
  {
    id: "padel",
    name: "Padel",
    tagline: "Doubles in premium glass courts",
    formats: ["Doubles", "Coaching", "Community"],
    heroImage: "/images/sports/padel-hero.jpg",
  },
  {
    id: "badminton",
    name: "Badminton",
    tagline: "Singles, doubles, mixed doubles",
    formats: ["Singles", "Doubles", "Mixed doubles"],
    heroImage: "/images/sports/badminton-hero.jpg",
  },
];

export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const APP_NAME = "Turfog";
export const APP_TAGLINE = "Never cancel a match again";

// Placeholder images (replace with original Turfog photography later)
export const PLACEHOLDER_IMAGES = {
  footballHero:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80",
  boxCricketHero:
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
  pickleballHero:
    "https://images.unsplash.com/photo-1554068696-82a4e2d1a5a4?w=1200&q=80",
  padelHero:
    "https://images.unsplash.com/photo-1554068696-82a4e2d1a5a4?w=1200&q=80",
  badmintonHero:
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80",
} as const;
