# Contributing to LinTO Studio Frontend

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Code Conventions

### Vue Components

- Use single-file components (`.vue`)
- Use existing components from `src/components/` before creating new ones
- Basics likely reusable components should be places in `src/components/atoms` or `src/components/molecules`.
- Use `FormInput` for all form inputs
- Use `PhIcon` components for icons, never use `<span class="icon">` it's deprecated
- Use `Button` component and not native button it's deprecated
- Never use vue filters
- Try as much as possible to write code which will be portable to vuejs 3
- For responsive design, try as much as possible to use `IsMobile` component, else use media query. Responsive design in JS is for the worst case.

### CSS/SCSS

- Use design system variables from `src/style/_variables.scss` because there are multiples themes
- Prefer existing utility classes (`flex`, `gap-medium`, etc.) from `src/style/_global.scss`
- Scoped styles in components, `studio-frontend/src/style/components` is keeped for big features/components and old code
- Try to follow BEM naming for CSS classes

### Internationalization

- All user-facing text must use `$t()` with keys in `src/locales/`
- Add translations for both `en-US.json` and `fr-FR.json`

### Accessibility

- Use existing components (`Button`, `FormInput`, etc.) which handle semantic HTML internally
- All interactive elements must be keyboard accessible
- Add `aria-label` on icon-only buttons
- Respect `prefers-reduced-motion` for animations:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
  ```
- Ensure sufficient color contrast (WCAG AA minimum)
- Form inputs must have associated labels (handled by `FormInput`)

### tools

- Code write in `src/tools` directory should be only pure function.
- One function per file with the same name as your function
- Test your function with a unit test in `src/tools/test/`
- the only exeption are files in `src/tools/fields` which are field tester and could depend of $t() for errors messages

## Pull Requests

1. Create a feature branch from `next`
2. Make your changes
3. Test locally
4. Submit PR with clear description
