
(function (window, document, $, Granite) {
  "use strict";

  $(window).adaptTo("foundation-registry").register("foundation.collection.action.action", {
    name: "discover.page.references",
    handler: function (name, el, config, collection, selections) {
      const paths = selections.map(function (v) {
        return $(v).data("foundationCollectionItemId");
      });
      if (!paths.length) return;
      showReferencesPopup(paths[0]);
    }
  });

  function showReferencesPopup(resourcePath) {
    const dialog = buildDialog("References", "Close");
    document.body.appendChild(dialog);
    dialog.open = true;

    // Put a loader into the body
    const body = dialog.querySelector(".ref-dialog-body");
    const header = dialog.querySelector("coral-dialog-content coral-dialog-header");
    const wait = new Coral.Wait();
    wait.setAttribute("variant", "spin");
    wait.classList.add("ref-wait");
    body.appendChild(wait);

    const url = Granite.HTTP.externalize(`${resourcePath}.page-references.json`);

    fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      .then(data => renderList(body, header, data.references.sort() || []))
      .catch(err => renderError(body, err))
      .finally(() => wait.remove());
  };

  // Build Coral dialog skeleton
  function buildDialog(titleText, closeText) {
    const dialog = document.createElement("coral-dialog");
    dialog.setAttribute("variant", "default");
    dialog.classList.add("ref-dialog");

    const header = document.createElement("coral-dialog-header");
    header.textContent = Granite.I18n.get(titleText);

    const content = document.createElement("coral-dialog-content");
    const body = document.createElement("div");
    body.classList.add("ref-dialog-body");
    content.appendChild(body);

    const footer = document.createElement("coral-dialog-footer");
    const close = document.createElement("coral-button");
    close.setAttribute("variant", "primary");
    close.textContent = Granite.I18n.get(closeText);
    close.addEventListener("click", () => dialog.remove());
    footer.appendChild(close);

    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(footer);

    return dialog;
  }

  function renderList(container, header, references) {
    container.innerHTML = "";

    if (!references || !references.length) {
      container.textContent = Granite.I18n.get("No references found.");
      return;
    }

    if (header) {
      header.textContent = `${Granite.I18n.get("References")} (${references.length})`;
    }

    const list = document.createElement("ul");

    references.forEach((rawPath) => {
      const path = normalizePath(rawPath);

      // Build URLs
      const pageHtmlUrl = Granite.HTTP.externalize(`${path}.html`);
      const sitesUrl = Granite.HTTP.externalize(`/sites.html${path}`);
      const editorUrl = Granite.HTTP.externalize(`/editor.html${path}.html`);

      const li = document.createElement("li");

      // Main path link (same as "html")
      const pathA = document.createElement("span");
      pathA.textContent = path;
      li.appendChild(pathA);

      // " (html, sites, editor) "
      const sepTextBefore = document.createTextNode(" (");
      li.appendChild(sepTextBefore);

      // sites
      li.appendChild(buildMiniLink("sites", sitesUrl));
      li.appendChild(document.createTextNode(", "));

      // editor
      li.appendChild(buildMiniLink("editor", editorUrl));
      li.appendChild(document.createTextNode(", "));

      // html
      li.appendChild(buildMiniLink("html", pageHtmlUrl));

      const sepTextAfter = document.createTextNode(")");
      li.appendChild(sepTextAfter);

      list.appendChild(li);
    });

    container.appendChild(list);

    function buildMiniLink(label, href) {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = label;
      return a;
    }

    function normalizePath(p) {
      // ensure leading slash, strip trailing .html if present
      let out = (p || "").trim();
      if (!out.startsWith("/")) out = "/" + out;
      if (out.endsWith(".html")) out = out.slice(0, -5);
      return out;
    }
  }

  // Render an error message
  function renderError(container, err) {
    container.innerHTML = "";
    const alert = document.createElement("coral-alert");
    alert.setAttribute("variant", "error");
    alert.setAttribute("closable", ""); // allow dismiss
    const header = document.createElement("coral-alert-header");
    header.textContent = Granite.I18n.get("Error");
    const content = document.createElement("coral-alert-content");
    content.textContent = (err && err.message) ? err.message : Granite.I18n.get("Failed to load references.");
    alert.appendChild(header);
    alert.appendChild(content);
    container.appendChild(alert);
  }
})(window, document, Granite.$, Granite);
