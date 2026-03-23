# Contributing to LinTO Studio Frontend

## Philosophy

This project has a visual and technical coherence built over time. The goal when contributing is to **strengthen it**, not just make the code work.

Before submitting, ask yourself:

- Does this feel consistent with the rest of the codebase?
- Did I reuse what already exists, or did I reinvent something?
- Would a user notice something feels off?

Being a good contributor here means having both a developer's eye for clean code and a designer's sensitivity for coherent UI. The rules below are guardrails — judgment still matters.

---

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

---

## ⚠️ Before Writing Any Code

Run through this checklist **before** implementing anything:

1. **Component already exists?** Check `src/components/` — improve or reuse before creating.
2. **CSS class already exists?** Check `src/style/_global.scss` — use utility classes before writing CSS.
3. **State belongs in the route?** If the user could share a link to this state, put it in the route.
4. **Text is user-facing?** It must go through `$t()` — never hardcode strings.
5. **Using a form element?** There's a component for it — never use native `<select>`, `<checkbox>`, `<radio>` directly.

---

## Project Architecture

```
src/
├── api/                  # All API calls — one file per resource
├── components/
│   ├── atoms/            # Smallest reusable units (buttons, inputs, badges…)
│   ├── molecules/        # Composed components (form groups, cards…)
│   └── …                 # Feature-level components
├── views/                # Page-level components (one per route)
├── locales/
│   ├── en-US.json
│   └── fr-FR.json
├── routers/              # Route definitions — data loading happens here
├── store/                # Global state — use sparingly
├── style/
│   ├── _variables.scss   # Design tokens (colors, spacing, themes) — always use these
│   ├── _global.scss      # Utility classes (flex, gap-*, etc.) — use before writing CSS
│   └── components/       # Legacy/large feature styles — avoid adding new files here
└── tools/                # Pure functions only, one function per file
```

---

## Code Conventions

### Vue Components

- Use single-file components (`.vue`)
- **Reuse and improve existing components** from `src/components/` before creating new ones — if a component almost fits, extend it
- Basics likely reusable components should be placed in `src/components/atoms` or `src/components/molecules`
- Try as much as possible to write code portable to **Vue 3** (see Vue 3 migration section below)
- Use `v-model` on components — it pairs well with a computed get/set to keep parent–child binding clean:

  ```js
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        if (this.disabled) return
        this.$emit("input", value)
      },
    },
  },
  ```

### Forms & Accessibility

Using semantic form elements is **free accessibility** — always do it:

- Wrap inputs in a `<form>` element with a `<Button type="submit">` — this gives keyboard submission (`Enter`), native validation, and screen reader support for free
- Never handle form submission with only a `@click` on an isolated button
- Always use `<FormInput>` for any input or textarea — never the native elements directly
- Always use `<PopoverList>` instead of native `<select>`
- For checkboxes and radio buttons, use `<FormCheckbox>` and `<FormRadio>` — never style the native ones
- All interactive elements must be keyboard accessible
- Add `aria-label` on icon-only buttons
- Ensure sufficient color contrast (WCAG AA minimum)

#### FormInput & the `field` object pattern

`<FormInput>` takes a `field` object as its main prop. This object drives the label, type, value, validation, and error display. The base structure is defined in `src/const/emptyField.js`:

```js
// src/const/emptyField.js
const EMPTY_FIELD = {
  value: "", // Current value
  error: null, // Error message (null = no error)
  valid: false, // Set by validation
  loading: false, // Loading state
}
```

A typical field definition extends it with `label`, `type`, `testField`, etc.:

```js
import EMPTY_FIELD from "@/const/emptyField"
import testEmail from "@/tools/fields/testEmail"

data() {
  return {
    email: {
      ...EMPTY_FIELD,
      label: this.$t("login.email_label"),
      testField: testEmail,
    },
    password: {
      ...EMPTY_FIELD,
      label: this.$t("login.password_label"),
      type: "password",
    },
  }
}
```

Available field properties:

| Property       | Type           | Description                                                                           |
| -------------- | -------------- | ------------------------------------------------------------------------------------- |
| `value`        | String         | Current value                                                                         |
| `error`        | String \| null | Error message — `null` means no error                                                 |
| `valid`        | Boolean        | Set by validation functions                                                           |
| `label`        | String         | Label displayed above the input                                                       |
| `type`         | String         | HTML input type (`"text"`, `"password"`, `"email"`, `"date"`, `"range"`, `"number"`)  |
| `placeholder`  | String         | Placeholder text                                                                      |
| `testField`    | Function       | Validation function `(field, t) => boolean` — sets `field.error` and returns validity |
| `required`     | Boolean        | If true, `testFields()` checks for empty value                                        |
| `autocomplete` | String         | HTML `autocomplete` attribute                                                         |
| `customParams` | Object         | Additional HTML attributes passed to the `<input>` (`min`, `max`, etc.)               |

**Basic usage — text input with v-model:**

```vue
<FormInput :field="email" v-model="email.value" />
```

**Select field — PopoverList in `#custom-input` slot:**

```vue
<FormInput :field="{ label: $t('session.language'), error: null }">
  <template #custom-input>
    <PopoverList :items="langs" v-model="selectedLang" />
  </template>
</FormInput>
```

**Readonly display with action buttons:**

```vue
<FormInput :field="fieldLink" readonly>
  <template #content-after-input>
    <Button @click="copyLink" icon="copy" iconOnly />
  </template>
</FormInput>
```

**Inline field object** — for simple cases without validation, define the field inline:

```vue
<FormInput
  :field="{ label: $t('filters.start_date'), type: 'date', error: null }"
  :value="startDate"
  @input="startDate = $event" />
```

**Validation** — use the `formsMixin` from `src/mixins/forms.js`:

```js
import { formsMixin } from "@/mixins/forms"

export default {
  mixins: [formsMixin],
  data() {
    return {
      fields: ["email", "password"], // field names to validate
      email: { ...EMPTY_FIELD, testField: testEmail, label: "Email" },
      password: { ...EMPTY_FIELD, testField: testPassword, label: "Password" },
    }
  },
  methods: {
    submit() {
      if (this.testFields()) {
        // all fields are valid — proceed
      }
    },
  },
}
```

**Other props:** `textarea`, `readonly`, `code` (renders in `<pre>`), `inline`, `withConfirmation` (shows confirm/cancel buttons on change), `focus` (auto-focus on mount), `inputFullWidth`.

**Available slots:** `#custom-input` (scoped: `id`, `disabled`), `#content-after-label`, `#content-after-input`, `#content-bottom-input`.

### Icons

- Use `PhIcon` components for icons — never `<span class="icon">` (deprecated)
- **Minimum size: 20px** — only go below with a justified exception

### CSS/SCSS

This project is mature. The vast majority of visual needs are already covered — **writing CSS should be the exception, not the reflex**.

Before writing any CSS, ask yourself in order:

1. Is there a utility class in `_global.scss` that covers this? (`flex`, `gap-medium`, `text-cut`, `fullwidth`…)
2. Is there a Vue component I can use or improve instead?
3. Do I actually need custom CSS here?

If you do need to write CSS:

- Use design system variables from `src/style/_variables.scss` — the project supports multiple themes, hardcoded values break them
- Use scoped styles in components
- `src/style/components/` is for legacy/large feature styles — avoid adding new files there
- Follow BEM naming for CSS classes
- Don't use `@mixin` — prefer a Vue component or a generic class
- Write CSS, not SCSS — no nesting, no variables (use the design system ones instead)
- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
  ```

**Anti-patterns:**

```css
/* ❌ Hardcoded values — breaks themes */
color: #3d5a80;
padding: 12px;

/* ✅ Use design tokens */
color: var(--primary-color);
padding: var(--medium-gap);
```

### State Management

State has a priority order — use the simplest option that works:

1. **Props** — for state shared between a parent and its children. Explicit, local, easy to trace.
2. **Route / URL** — for state the user might want to share or bookmark. The router is responsible for loading the right data when landing on a URL.
3. **Store** — last resort, only for truly global state (logged-in user, permissions, global loading). Use sparingly.

```js
// ❌ Storing something in the store that belongs in the URL
this.$store.commit("filters/setSearch", query)

// ✅ Put it in the route — it's shareable and the router rehydrates it
this.$router.push({ query: { search: query } })
```

**Never use the EventBus** for reactive state:

```js
// ❌ Never
import { bus } from "@/main.js"
bus.$on("update", handler)
bus.$emit("update", data)

// ✅ Instead: props if local, store if truly global
```

### Router & Data Loading

The router is responsible for loading page data. When a page component mounts, its critical data must already be available — either passed as props or present in the store.

- Load data in route guards (`beforeEnter`) or the router's entry point — not in `mounted()`
- If a page needs to fetch data after routing, **keep the global loading state active** until it's ready:
  ```js
  this.$store.dispatch("system/setIsLoading", true)
  // ... fetch data ...
  this.$store.dispatch("system/setIsLoading", false)
  ```
- Never leave the UI in an unknown state — always show a loading indicator during API calls
- For local actions (e.g. a form submit button), manage a local loading state on the component

### API Calls

- All API calls must be written in `src/api/` — never inline in components or store actions
- One file per resource/domain

### Internationalization

- All user-facing text must use `$t()` with keys in `src/locales/`
- Add translations for both `en-US.json` and `fr-FR.json`

```vue
<!-- ❌ -->
<p>Save changes</p>

<!-- ✅ -->
<p>{{ $t('actions.save') }}</p>
```

### Tools

- Code written in `src/tools/` must be **pure functions only** — no side effects, no API calls, no `$t()`
- One function per file, named the same as the function
- Test your function with a unit test in `src/tools/test/`
- Exception: files in `src/tools/fields/` are field validators and may depend on `$t()` for error messages

---

## Responsive & Future-Proofing

### Mobile & Offline

The project is heading towards a mobile-first webapp, potentially with offline support. Keep this in mind:

- For responsive behavior, use the `IsMobile` component first, then CSS media queries — **never** responsive logic in JS
- Avoid desktop-only interactions (hover states as the only affordance, right-click menus) without a touch fallback
- Think touch-friendly: clickable areas should be large enough
- Avoid patterns that assume a constant network connection (blocking API calls on render, no loading states)

### Vue 3 Migration

The project will migrate to Vue 3. Write forward-compatible code:

- **Never use Vue 2-only patterns:**

  ```js
  // ❌ Filters (removed in Vue 3)
  {
    {
      date | formatDate
    }
  }

  // ❌ EventBus
  import { bus } from "@/main.js"

  // ❌ $listeners, $children (removed in Vue 3)
  this.$listeners
  this.$children
  ```

- Prefer the Composition API when possible, or at least avoid deeply coupled Options API patterns
- Less custom code = less migration debt

---

## Pull Requests

1. Create a feature branch from `next`
2. Make your changes
3. Test locally
4. Submit a PR with a clear description of what changed and why
