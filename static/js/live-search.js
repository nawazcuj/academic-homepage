(() => {
  const input = document.getElementById("tt-live-search");
  if (!input) return;

  const holder = input.closest("label");
  if (!holder) return;
  holder.classList.add("tt-search-holder");

  const panel = document.createElement("div");
  panel.id = "tt-search-suggestions";
  panel.className = "tt-search-suggestions";
  panel.setAttribute("role", "listbox");
  panel.setAttribute("aria-label", "Search suggestions");
  panel.hidden = true;
  holder.appendChild(panel);

  let timer;
  let controller;
  let selected = -1;
  let options = [];

  function close() {
    panel.hidden = true;
    panel.replaceChildren();
    selected = -1;
    options = [];
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function highlight() {
    options.forEach((node, index) => {
      node.classList.toggle("is-selected", index === selected);
      node.setAttribute("aria-selected", String(index === selected));
    });
    if (selected >= 0) {
      input.setAttribute("aria-activedescendant", options[selected].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function show(results) {
    panel.replaceChildren();
    options = [];
    selected = -1;

    if (!results.length) {
      const message = document.createElement("div");
      message.className = "tt-search-empty";
      message.textContent = "No matching suggestions";
      panel.appendChild(message);
    }

    results.forEach((item, index) => {
      const link = document.createElement("a");
      link.id = "tt-suggestion-" + index;
      link.href = item.url;
      link.className = "tt-search-suggestion";
      link.setAttribute("role", "option");
      link.setAttribute("aria-selected", "false");

      const heading = document.createElement("span");
      heading.className = "tt-suggestion-title";
      heading.textContent = item.title;

      const category = document.createElement("span");
      category.className = "tt-suggestion-category";
      category.textContent = item.category;

      link.append(heading, category);

      if (item.summary) {
        const summary = document.createElement("span");
        summary.className = "tt-suggestion-summary";
        summary.textContent = item.summary;
        link.appendChild(summary);
      }

      link.addEventListener("mouseenter", () => {
        selected = index;
        highlight();
      });

      panel.appendChild(link);
      options.push(link);
    });

    panel.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  async function search(value) {
    if (controller) controller.abort();
    controller = new AbortController();
    const current = controller;

    try {
      const response = await fetch(
        "/api/search/suggest?q=" + encodeURIComponent(value),
        { signal: current.signal }
      );
      if (!response.ok) throw new Error("Search request failed");
      const data = await response.json();
      if (current !== controller || input.value.trim() !== value) return;
      show(data.results || []);
    } catch (error) {
      if (error.name !== "AbortError") close();
    }
  }

  input.addEventListener("input", () => {
    clearTimeout(timer);
    if (controller) controller.abort();

    const value = input.value.trim();
    close();

    if (value.length < 2) return;
    timer = setTimeout(() => search(value), 220);
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (panel.hidden || !options.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selected = (selected + 1) % options.length;
      highlight();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selected = (selected - 1 + options.length) % options.length;
      highlight();
    } else if (event.key === "Enter" && selected >= 0) {
      event.preventDefault();
      window.location.assign(options[selected].href);
    }
  });

  document.addEventListener("click", event => {
    if (!holder.contains(event.target)) close();
  });
})();
