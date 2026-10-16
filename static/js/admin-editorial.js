
(() => {
  'use strict';

  const search = document.getElementById('tad-entry-search');
  const type = document.getElementById('tad-entry-type');
  const table = document.getElementById('tad-entries-table');

  if (!search || !type || !table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr[data-kind]'));
  const count = document.getElementById('tad-result-count');
  const none = document.getElementById('tad-no-matches');

  const typeLabels = new Map(
    Array.from(type.options)
      .filter(option => option.value)
      .map(option => [option.value, option.textContent.trim()])
  );

  const typeOrder = new Map(
    Array.from(typeLabels.keys()).map((kind, index) => [kind, index])
  );

  const normalize = value => String(value || '').trim().toLocaleLowerCase();

  const entries = rows.map((row, index) => {
    const cells = row.querySelectorAll('td');

    const category = cells[2]?.textContent.trim() || 'Uncategorized';

    return {
      row,
      index,
      kind: row.dataset.kind || '',
      category: category === '—' ? 'Uncategorized' : category,
      title: cells[1]?.textContent.trim() || '',
      searchText: normalize(row.textContent)
    };
  });

  // Sort by content type, then category, then title.
  entries.sort((a, b) =>
    (typeOrder.get(a.kind) ?? 999) - (typeOrder.get(b.kind) ?? 999)
    || a.category.localeCompare(b.category, undefined, { sensitivity: 'base' })
    || a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    || a.index - b.index
  );

  // Rebuild the table with category headings.
  // Existing rows and their Edit/Delete forms remain unchanged.
  const fragment = document.createDocumentFragment();
  const groups = [];
  let lastKind = null;
  let lastCategory = null;
  let currentTypeGroup = null;
  let currentCategoryGroup = null;

  function heading(className, title) {
    const tr = document.createElement('tr');
    tr.className = className;

    const td = document.createElement('td');
    td.colSpan = 4;

    const label = document.createElement('span');
    label.textContent = title;

    const number = document.createElement('span');
    number.className = 'tad-group-count';

    td.append(label, number);
    tr.append(td);

    return { row: tr, number };
  }

  for (const entry of entries) {
    if (entry.kind !== lastKind) {
      const title = typeLabels.get(entry.kind) || entry.kind;
      const header = heading('tad-type-heading', title);

      currentTypeGroup = {
        header,
        members: []
      };

      groups.push(currentTypeGroup);
      fragment.append(header.row);

      lastKind = entry.kind;
      lastCategory = null;
    }

    currentTypeGroup.members.push(entry);

    if (entry.category !== lastCategory) {
      const header = heading('tad-category-heading', entry.category);

      currentCategoryGroup = {
        header,
        members: []
      };

      groups.push(currentCategoryGroup);
      fragment.append(header.row);

      lastCategory = entry.category;
    }

    currentCategoryGroup.members.push(entry);
    fragment.append(entry.row);
  }

  if (entries.length) {
    tbody.replaceChildren(fragment);
  }

  function update() {
    const query = normalize(search.value);
    const selectedKind = type.value;

    let visible = 0;

    for (const entry of entries) {
      const match =
        (!selectedKind || selectedKind === entry.kind)
        && (
          !query
          || entry.searchText.includes(query)
        );

      entry.row.hidden = !match;
      if (match) visible++;
    }

    for (const group of groups) {
      const amount = group.members.filter(
        entry => !entry.row.hidden
      ).length;

      group.header.row.hidden = amount === 0;
      group.header.number.textContent = `${amount} entries`;
    }

    if (count) {
      count.textContent = `${visible} of ${entries.length} entries`;
    }

    if (none) {
      none.hidden = visible !== 0 || entries.length === 0;
    }
  }

  search.addEventListener('input', update);
  type.addEventListener('change', update);

  update();
})();
