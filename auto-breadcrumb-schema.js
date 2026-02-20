(function () {
  "use strict";

  function toAbsoluteUrl(url) {
    if (!url) return window.location.href;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("//")) return window.location.protocol + url;
    if (url.startsWith("/")) return window.location.origin + url;
    var base = window.location.href.replace(/\/[^\/]*$/, "/");
    return base + url;
  }

  function getLabel(el) {
    var nameEl = el.querySelector("[fj-breadcrumb='name']");
    if (nameEl) {
      var nameText = nameEl.textContent.trim();
      if (nameText) return nameText;
    }
    var text = el.textContent.trim();
    if (text) return text;
    var img = el.querySelector("img");
    if (img && img.alt && img.alt.trim()) return img.alt.trim();
    return null;
  }

  function getUrl(el, isLast) {
    var linkEl = el.querySelector("[fj-breadcrumb='link']");
    if (linkEl && linkEl.getAttribute("href")) {
      return toAbsoluteUrl(linkEl.getAttribute("href"));
    }
    if (el.tagName === "A" && el.getAttribute("href")) {
      return toAbsoluteUrl(el.getAttribute("href"));
    }
    var childLink = el.querySelector("a[href]");
    if (childLink) {
      return toAbsoluteUrl(childLink.getAttribute("href"));
    }
    if (isLast) return window.location.href;
    return null;
  }

  function generateBreadcrumbSchema() {
    if (document.querySelector("script[data-flowjoy='breadcrumb-schema']")) return;

    var list = document.querySelector("[fj-breadcrumb='list']");
    if (!list) return;

    var items = list.querySelectorAll("[fj-breadcrumb='item']");
    if (!items || items.length === 0) return;

    var breadcrumbItems = [];

    items.forEach(function (el, index) {
      var isLast = index === items.length - 1;
      var label = getLabel(el);
      var url = getUrl(el, isLast);

      if (!label || !url) return;
      if (url.startsWith("#") || /^javascript:/i.test(url)) return;

      breadcrumbItems.push({
        "@type": "ListItem",
        "position": breadcrumbItems.length + 1,
        "name": label,
        "item": url
      });
    });

    if (breadcrumbItems.length === 0) return;

    var schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-flowjoy", "breadcrumb-schema");
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", generateBreadcrumbSchema);
  } else {
    generateBreadcrumbSchema();
  }

})();
