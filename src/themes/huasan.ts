/** Palette-only variants of moyuGreen. Original components and geometry are unchanged.
 * Based on DemoJ/md2html and gzh-design-skill, AGPL-3.0-or-later.
 */
import { moyuGreen } from './moyu-green'
import type { DesignVars, ThemeConfig, ThemeComponents } from '../core/types'

type Palette = Pick<DesignVars, 'primary' | 'secondary' | 'lightBg' | 'lightBorder' | 'lightBorderSoft' | 'highlight' | 'highlightBg'>

function recolor(id: string, name: string, palette: Palette): ThemeConfig {
  const replacements = new Map<string, string>()
  for (const [key, color] of Object.entries(palette)) {
    const original = moyuGreen.designVars[key]
    if (original && color) replacements.set(original.toLowerCase(), color)
  }
  const hexToRgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',')
  // The original cover also uses literal rgba green accents. Preserve their alpha.
  const originalRgb = hexToRgb(moyuGreen.primary)
  const targetRgb = hexToRgb(palette.primary)
  const css = (value: string) => value
    .replace(/#[0-9a-f]{6}\b/gi, color => replacements.get(color.toLowerCase()) ?? color)
    .replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/gi,
      (whole, r, g, b, alpha) => `${r},${g},${b}` === originalRgb ? `rgba(${targetRgb},${alpha})` : whole)
  // Touch CSS values only: prose, markup, measurements and component order remain intact.
  const html = (value: string) => value.replace(/style="([^"]*)"/g, (_whole, style: string) => `style="${css(style)}"`)
  const components = Object.fromEntries(Object.entries(moyuGreen.components).map(([key, render]) =>
    [key, (...args: any[]) => html((render as (...args: any[]) => string)(...args))]
  )) as unknown as ThemeComponents
  return { ...moyuGreen, id, name, primary: palette.primary,
    description: '摸鱼绿原版式，仅替换主题色', designVars: { ...moyuGreen.designVars, ...palette },
    underlineCSS: css(moyuGreen.underlineCSS), components }
}

export const huasanClaude = recolor('huasan-claude', '画伞 · Claude 橙', {
  primary: '#c04a1a', secondary: '#d36636', lightBg: '#f9e9e1',
  lightBorder: '#dfa58b', lightBorderSoft: '#edc6b5', highlight: '#e6ad8f', highlightBg: '#fbeddf',
})
export const huasanForest = recolor('huasan-forest', '画伞 · 墨绿', {
  primary: '#365B47', secondary: '#4C765B', lightBg: '#EEF5EF',
  lightBorder: '#BCD4C1', lightBorderSoft: '#D1E2D3', highlight: '#C3D9B5', highlightBg: '#F3F7ED',
})
