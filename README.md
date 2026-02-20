# Auto Breadcrumb Schema

Automatically generates [BreadcrumbList schema markup](https://schema.org/BreadcrumbList) (`application/ld+json`) from existing breadcrumb elements on the page. Built for Webflow but works on any HTML page.

---

## Installation

Add the following `<script>` tag to your page's `<head>` or before `</body>`. Replace `@1.0.0` with the latest release version.

```html
<script defer src="https://cdn.jsdelivr.net/gh/flowjoystudio/auto-breadcrumb-schema@1.0.0/auto-breadcrumb-schema.js"></script>
```

---

## Usage

Add custom attributes to your existing breadcrumb elements. No changes to your visual design are needed.

### Required attributes

| Attribute | Value | Element |
|---|---|---|
| `fj-breadcrumb` | `list` | The breadcrumb wrapper element |
| `fj-breadcrumb` | `item` | Each individual breadcrumb item |

### Optional attributes

| Attribute | Value | Element |
|---|---|---|
| `fj-breadcrumb` | `name` | A child element whose text should be used as the label |
| `fj-breadcrumb` | `link` | A child element whose `href` should be used as the URL |

The `name` and `link` attributes are only needed if the script can't read the label or URL automatically from the item element itself.

---

## Examples

### Simple link-based breadcrumb

```html
<nav fj-breadcrumb="list">
  <a fj-breadcrumb="item" href="/">Home</a>
  <a fj-breadcrumb="item" href="/use-case">Use Cases</a>
  <span fj-breadcrumb="item">Solar</span>
</nav>
```

### Div-based breadcrumb with nested link and label

```html
<div fj-breadcrumb="list">
  <div fj-breadcrumb="item">
    <a href="/">Home</a>
  </div>
  <div fj-breadcrumb="item">
    <a href="/use-case">Use Cases</a>
  </div>
  <div fj-breadcrumb="item">
    <span>Solar</span>
  </div>
</div>
```

### Using explicit name and link attributes

```html
<div fj-breadcrumb="list">
  <div fj-breadcrumb="item">
    <img src="home-icon.svg" alt="Home" />
    <a fj-breadcrumb="link" href="/"></a>
  </div>
  <div fj-breadcrumb="item">
    <span fj-breadcrumb="name">Use Cases</span>
    <a fj-breadcrumb="link" href="/use-case"></a>
  </div>
</div>
```

---

## How it works

Once the DOM is loaded the script:

1. Finds the first element with `breadcrumb=list`
2. Collects all child elements with `breadcrumb=item`
3. For each item, resolves the label and URL using the priority chains below
4. Builds a valid `BreadcrumbList` schema object
5. Injects it into the `<head>` as a `<script type="application/ld+json">` tag

### Label priority chain
1. Text content of a `breadcrumb=name` child element
2. Text content of the item element itself
3. `alt` attribute of an `<img>` inside the item
4. Item is skipped if no label is found

### URL priority chain
1. `href` of a `breadcrumb=link` child element
2. `href` of the item element itself (if it's an `<a>` tag)
3. `href` of a child `<a>` element
4. Current page URL (used automatically for the last item if no link is found)
5. Item is skipped if no URL is found (except the last item)

---

## Webflow setup

1. Add `fj-breadcrumb` / `list` as a custom attribute on your breadcrumb nav or wrapper element
2. Add `fj-breadcrumb` / `item` on each breadcrumb link or item element
3. Optionally add `fj-breadcrumb` / `name` or `fj-breadcrumb` / `link` if your structure requires it

If you have both a desktop and mobile breadcrumb on the same page, only the first `breadcrumb=list` element will be used — preventing duplicate schema output.

---

## Known limitations

- Only the first `breadcrumb=list` element on the page is used
- Items with no resolvable label or URL are silently skipped
- Hash-only URLs (e.g. `#section`) and `javascript:` URLs are ignored
- Relative URLs are automatically converted to absolute using the current page origin

---

## License

MIT
