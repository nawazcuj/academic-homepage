# TheTrefoil — Academic Homepage

An independent academic homepage for mathematics, research, teaching, publications, and open resources. This is a **static** website and does not modify the original Flask/SQLite TheTrefoil project.

## Enable GitHub Pages

1. In this repository go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.
4. After GitHub publishes it, visit https://nawazcuj.github.io/academic-homepage/

The site has no build steps or paid hosting requirements.

## Customize

- `index.html`: biographical text, research, teaching and page sections.
- `assets/content.js`: academic links and verified publications.
- `assets/style.css`: responsive design, colours and background schemes.
- `assets/script.js`: appearance studio, quotes, and animated mathematical trefoil.

**Publication example** in `assets/content.js`:

```javascript
publications: [
  { title: "Verified paper title", authors: "Authors", venue: "Journal · Year", url: "https://doi.org/..." }
]
```

The Appearance Studio stores each visitor's preferences locally in their browser. No academic publications or contact addresses have been invented. GitHub Pages cannot run Flask, SQLite or server-side admin tools.
