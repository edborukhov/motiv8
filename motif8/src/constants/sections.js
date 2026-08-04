// The 8 core sections, in daily order. "diet" and "progress" are special
// sections that open a modal instead of toggling directly.
export const SECTIONS = [
  { key: "body", label: "Body", subtitle: "Cold shower, exercise", defaultTime: "06:00" },
  { key: "mind", label: "Mind", subtitle: "Meditation, journaling, kaizen", defaultTime: "06:30" },
  { key: "growth", label: "Growth", subtitle: "Reading, podcasts", defaultTime: null },
  { key: "diet", label: "Diet", subtitle: "Water, protein, vitamins", defaultTime: "13:00" },
  { key: "focus", label: "Focus", subtitle: "Projects", defaultTime: "09:00" },
  { key: "reflection", label: "Reflection", subtitle: "Wrap-up, plan tomorrow", defaultTime: "21:00" },
  { key: "sleep", label: "Sleep", subtitle: "Wind-down", defaultTime: "22:30" },
  { key: "progress", label: "Progress", subtitle: "Daily photo", defaultTime: "22:00" },
];

export const TRANSFORMATION_LENGTH = 90;

export const DIET_ITEMS = [
  { key: "water", label: "1 gallon of water" },
  { key: "protein", label: "Protein" },
  { key: "vitamins", label: "Vitamins" },
  { key: "calories", label: "Calories logged" },
];
