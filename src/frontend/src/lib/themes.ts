export interface Theme {
  id: string;
  name: string;
  description: string;
  emoji: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
  };
  palette: string[]; // 4 swatches for display
}

export const THEMES: Record<string, Theme> = {
  rose_garden: {
    id: "rose_garden",
    name: "Rose Garden",
    description: "Soft blush pinks and romantic rose tones",
    emoji: "🌹",
    palette: ["#F9D0D0", "#F4A8A8", "#E07B7B", "#C14F4F"],
    colors: {
      background: "#FDF0F0",
      surface: "#FFF5F5",
      primary: "#E07B7B",
      secondary: "#F9D0D0",
      text: "#3D1515",
      textMuted: "#8B5252",
      border: "#F4A8A8",
      accent: "#C14F4F",
    },
  },
  ocean_dream: {
    id: "ocean_dream",
    name: "Ocean Dream",
    description: "Serene teals and deep ocean blues",
    emoji: "🌊",
    palette: ["#B2E0E8", "#6BBFCC", "#3A8FA0", "#1E5F6E"],
    colors: {
      background: "#EDF8FA",
      surface: "#F5FCFD",
      primary: "#3A8FA0",
      secondary: "#B2E0E8",
      text: "#0E2F36",
      textMuted: "#3A6670",
      border: "#6BBFCC",
      accent: "#1E5F6E",
    },
  },
  forest_magic: {
    id: "forest_magic",
    name: "Forest Magic",
    description: "Earthy greens and enchanted woodland tones",
    emoji: "🌿",
    palette: ["#C4DFC0", "#8BBF85", "#5F8F5A", "#2D5228"],
    colors: {
      background: "#EFF6EE",
      surface: "#F5FAF4",
      primary: "#5F8F5A",
      secondary: "#C4DFC0",
      text: "#162315",
      textMuted: "#3D6038",
      border: "#8BBF85",
      accent: "#2D5228",
    },
  },
  sunset_glow: {
    id: "sunset_glow",
    name: "Sunset Glow",
    description: "Warm oranges and golden hour yellows",
    emoji: "🌅",
    palette: ["#FFE0B0", "#FFBF70", "#FF9A3C", "#E06A10"],
    colors: {
      background: "#FFF8EE",
      surface: "#FFFBF5",
      primary: "#FF9A3C",
      secondary: "#FFE0B0",
      text: "#3D1F00",
      textMuted: "#8B4E15",
      border: "#FFBF70",
      accent: "#E06A10",
    },
  },
  lavender_haze: {
    id: "lavender_haze",
    name: "Lavender Haze",
    description: "Dreamy purples and soft violet whispers",
    emoji: "💜",
    palette: ["#E8D5F0", "#C9A8E0", "#9F6FBF", "#6B3D8F"],
    colors: {
      background: "#F5EEF9",
      surface: "#FAF5FC",
      primary: "#9F6FBF",
      secondary: "#E8D5F0",
      text: "#250D35",
      textMuted: "#6B3D8F",
      border: "#C9A8E0",
      accent: "#6B3D8F",
    },
  },
  mocha_latte: {
    id: "mocha_latte",
    name: "Mocha Latte",
    description: "Rich browns and warm creamy tones",
    emoji: "☕",
    palette: ["#EDD9C8", "#C9A882", "#9E7553", "#5E3D24"],
    colors: {
      background: "#F8F0E8",
      surface: "#FDF8F3",
      primary: "#9E7553",
      secondary: "#EDD9C8",
      text: "#2A1508",
      textMuted: "#7A5035",
      border: "#C9A882",
      accent: "#5E3D24",
    },
  },
  midnight_jazz: {
    id: "midnight_jazz",
    name: "Midnight Jazz",
    description: "Sophisticated dark blues with golden accents",
    emoji: "🎷",
    palette: ["#1A2744", "#2E3F6E", "#4A6090", "#C4A035"],
    colors: {
      background: "#0F1929",
      surface: "#1A2744",
      primary: "#C4A035",
      secondary: "#2E3F6E",
      text: "#F0E8D0",
      textMuted: "#9AADC0",
      border: "#2E3F6E",
      accent: "#C4A035",
    },
  },
  cherry_blossom: {
    id: "cherry_blossom",
    name: "Cherry Blossom",
    description: "Delicate pinks and pure white petals",
    emoji: "🌸",
    palette: ["#FFE8F0", "#FFB8D0", "#FF7BAE", "#CC4070"],
    colors: {
      background: "#FFF5F8",
      surface: "#FFFAFC",
      primary: "#FF7BAE",
      secondary: "#FFE8F0",
      text: "#330D1A",
      textMuted: "#993355",
      border: "#FFB8D0",
      accent: "#CC4070",
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(id: string): Theme {
  return THEMES[id] || THEMES.rose_garden;
}
