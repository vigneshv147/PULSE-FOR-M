# Color Palette

## Neon Glow Colors
- **Neon Cyan**: `#00FFFF`
- **Electric Purple**: `#BF00FF`
- **Vivid Blue**: `#0066FF`
- **Soft White**: `#F5F5F5`

## Gradient Definitions
- **Primary Gradient**: `linear-gradient(135deg, #00FFFF, #BF00FF)`
- **Secondary Gradient**: `linear-gradient(45deg, #0066FF, #00FFFF)`

## CSS Variables (example)
```css
:root {
  --color-cyan: #00FFFF;
  --color-purple: #BF00FF;
  --color-blue: #0066FF;
  --color-white: #F5F5F5;
  --gradient-primary: linear-gradient(135deg, var(--color-cyan), var(--color-purple));
  --gradient-secondary: linear-gradient(45deg, var(--color-blue), var(--color-cyan));
}
```
