# Typography

## Font Families
- **Primary**: `Inter` – Clean, modern sans‑serif, excellent legibility.
- **Secondary**: `Outfit` – Elegant display font for headings and accent text.

## Font Scale
| Level | HTML Tag | Font Size | Line Height | Weight |
|-------|----------|-----------|-------------|--------|
| Display 1 | `h1` | 96px | 1.2 | 700 |
| Display 2 | `h2` | 72px | 1.2 | 600 |
| Heading 1 | `h3` | 48px | 1.3 | 600 |
| Heading 2 | `h4` | 36px | 1.4 | 500 |
| Body Large | `p.large` | 20px | 1.5 | 400 |
| Body Regular | `p` | 16px | 1.6 | 400 |
| Caption | `small` | 12px | 1.6 | 300 |

## CSS Variables Example
```css
:root {
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Outfit', serif;
  --font-size-display-1: 96px;
  --font-size-h1: 48px;
  /* ... */
}
```
