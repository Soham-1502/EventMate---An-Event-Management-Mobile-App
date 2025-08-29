// theme.js
export const themes = {
  ocean: {
    primary: "#0077B6",     // Deep ocean blue
    secondary: "#00B4D8",   // Bright aqua
    background: "#CAF0F8",  // Light sea foam
    text: "#023E8A",        // Navy for text
    accent: "#90E0EF",      // Soft turquoise
    error: "#FF4D6D",       // Coral red
    success: "#4CAF50",     // Green success
  },
  forest: {
    primary: "#2E7D32",     // Dark green
    secondary: "#81C784",   // Light green
    background: "#E8F5E9",  // Pale green background
    text: "#1B5E20",        // Deep forest text
    accent: "#A5D6A7",      // Soft leaf green
    error: "#E53935",       // Bright red
    success: "#388E3C",     // Darker green
  },
  sunset: {
    primary: "#FF6F61",     // Coral sunset
    secondary: "#FFD166",   // Golden yellow
    background: "#FFF3E0",  // Light peach
    text: "#6D4C41",        // Warm brown
    accent: "#FF9E80",      // Soft orange
    error: "#D32F2F",       // Rich red
    success: "#81C784",     // Fresh green
  },
  midnight: {
    primary: "#0D1B2A",     // Deep navy
    secondary: "#1B263B",   // Slate blue
    background: "#E0E1DD",  // Soft light gray
    text: "#0D1B2A",        // Dark navy text
    accent: "#778DA9",      // Muted blue
    error: "#EF233C",       // Red highlight
    success: "#4CAF50",     // Green success
  }
};

// Default theme
export const defaultTheme = themes.forest;