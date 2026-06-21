export function getPlayerColor(flag) {
  const colors = {
    "🇧🇷": "#00a86b",
    "🇩🇪": "#d4a017",
    "🇫🇷": "#2563eb",
    "🇪🇸": "#d62828",
    "🇮🇹": "#2a9d8f",
    "🇺🇸": "#4361ee",
    "🇦🇷": "#5fa8d3",
    "🇬🇧": "#264653",
    "🇷🇸": "#3a86ff",
    "🇦🇺": "#3d5a80",
  };

  return colors[flag] || "#9ca3af";
}
