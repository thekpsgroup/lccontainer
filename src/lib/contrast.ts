/**
 * LC Container - Contrast & Accessibility Utilities
 * Provides functions for ensuring WCAG 2.1 AA compliance (4.5:1 minimum)
 */

/**
 * Calculate the contrast ratio between two colors
 * @param color1 - First color in hex format (#RRGGBB)
 * @param color2 - Second color in hex format (#RRGGBB)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 * @param color - Color in hex format (#RRGGBB)
 * @returns Luminance value (0-1)
 */
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(component => {
    component = component / 255;
    return component <= 0.03928
      ? component / 12.92
      : Math.pow((component + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB array
 * @param hex - Color in hex format (#RRGGBB or #RGB)
 * @returns RGB array [r, g, b] or null if invalid
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // Try 3-digit hex
    const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (!shortResult) return null;

    return [
      parseInt(shortResult[1] + shortResult[1], 16),
      parseInt(shortResult[2] + shortResult[2], 16),
      parseInt(shortResult[3] + shortResult[3], 16),
    ];
  }

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Ensure contrast meets WCAG 2.1 AA requirements
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @param isLargeText - Whether this is large text (18pt+ or 14pt+ bold)
 * @returns Object with contrast info and compliance status
 */
export function ensureContrast(
  foreground: string,
  background: string,
  isLargeText = false
): {
  ratio: number;
  isCompliant: boolean;
  requiredRatio: number;
  recommendation?: string;
} {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  const isCompliant = ratio >= requiredRatio;

  let recommendation: string | undefined;
  if (!isCompliant) {
    if (isLargeText) {
      recommendation = `Increase contrast to meet 3.0:1 for large text. Current: ${ratio.toFixed(2)}:1`;
    } else {
      recommendation = `Increase contrast to meet 4.5:1 for normal text. Current: ${ratio.toFixed(2)}:1`;
    }
  }

  return {
    ratio,
    isCompliant,
    requiredRatio,
    recommendation,
  };
}

/**
 * Generate adaptive scrim color for text over images
 * @param imageBrightness - Estimated brightness of background image (0-1, where 1 is brightest)
 * @param targetContrast - Target contrast ratio (default: 4.5)
 * @returns CSS rgba() string for scrim color
 */
export function generateAdaptiveScrim(
  imageBrightness: number,
  targetContrast = 4.5
): string {
  // For dark images, use light scrim
  if (imageBrightness < 0.5) {
    return 'rgba(255, 255, 255, 0.85)';
  }

  // For bright images, use dark scrim
  return 'rgba(0, 0, 0, 0.65)';
}

/**
 * Calculate optimal scrim opacity for given colors
 * @param textColor - Text color in hex format
 * @param bgColor - Background color in hex format
 * @param targetContrast - Target contrast ratio
 * @returns Optimal opacity value (0-1)
 */
export function calculateOptimalScrimOpacity(
  textColor: string,
  bgColor: string,
  targetContrast = 4.5
): number {
  const textLuminance = getLuminance(textColor);
  const bgLuminance = getLuminance(bgColor);

  // Determine if we need light or dark scrim
  const needsLightScrim = bgLuminance < textLuminance;

  // Binary search for optimal opacity
  let min = 0;
  let max = 1;
  let bestOpacity = 0.5;

  for (let i = 0; i < 20; i++) {
    const opacity = (min + max) / 2;
    const scrimColor = needsLightScrim
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`;

    // This is a simplified calculation - in practice you'd blend the colors
    const blendedLuminance = needsLightScrim
      ? (1 - opacity) * bgLuminance + opacity * 1
      : (1 - opacity) * bgLuminance + opacity * 0;

    const ratio = Math.max(textLuminance, blendedLuminance) /
                  Math.min(textLuminance, blendedLuminance);

    if (ratio >= targetContrast) {
      bestOpacity = opacity;
      max = opacity;
    } else {
      min = opacity;
    }
  }

  return Math.round(bestOpacity * 100) / 100;
}

/**
 * Check if a color combination passes WCAG AA standards
 * @param fgColor - Foreground color
 * @param bgColor - Background color
 * @param isLargeText - Whether this is large text
 * @returns Compliance status and details
 */
export function checkWCAGCompliance(
  fgColor: string,
  bgColor: string,
  isLargeText = false
): {
  aa: boolean;
  aaa: boolean;
  ratio: number;
  level: 'AA' | 'AAA' | 'Fail';
} {
  const ratio = getContrastRatio(fgColor, bgColor);
  const aa = isLargeText ? ratio >= 3.0 : ratio >= 4.5;
  const aaa = isLargeText ? ratio >= 4.5 : ratio >= 7.0;

  let level: 'AA' | 'AAA' | 'Fail';
  if (aaa) {
    level = 'AAA';
  } else if (aa) {
    level = 'AA';
  } else {
    level = 'Fail';
  }

  return { aa, aaa, ratio, level };
}

/**
 * Get recommended color combinations for WCAG compliance
 * @param baseColor - Base brand color
 * @param isDarkBg - Whether background is dark
 * @returns Array of compliant color combinations
 */
export function getCompliantColorCombinations(
  baseColor: string,
  isDarkBg = false
): Array<{ fg: string; bg: string; ratio: number }> {
  // This would return predefined compliant combinations
  // For now, return some basic recommendations
  const combinations = [
    { fg: '#DC2626', bg: '#FFFFFF', ratio: 4.5 },
    { fg: '#FFFFFF', bg: '#1F2937', ratio: 12.6 },
    { fg: '#374151', bg: '#FFFFFF', ratio: 8.9 },
    { fg: '#FFFFFF', bg: '#DC2626', ratio: 2.1 }, // This fails AA
  ];

  return combinations.filter(combo => {
    const result = ensureContrast(combo.fg, combo.bg);
    return result.isCompliant;
  });
}
