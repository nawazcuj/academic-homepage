
document.addEventListener("DOMContentLoaded", function () {

    const source = document.getElementById("import-source");
    const identifier = document.getElementById("import-identifier");
    const button = document.getElementById("import-publication-btn");
    const status = document.getElementById("import-status");
    const form = document.querySelector("form.contact-form") || document.querySelector("form.tce-form") || document.querySelector("form[enctype=\"multipart/form-data\"]");

    if (!source || !identifier || !button || !status || !form) {
        console.error("Publication importer elements not found.");
        return;
    }

    // Change placeholder according to selected source.
    source.addEventListener("change", function () {
        identifier.placeholder =
            source.value === "arxiv"
                ? "https://arxiv.org/abs/2609.17651v1"
                : "https://doi.org/10.1080/00927872.2022.2107211";
    });

    // Update an existing field in the publication form.
    function setField(name, value) {
        const field = form.elements.namedItem(name);

        if (field && value !== undefined && value !== null) {
            field.value = value;
        }
    }

    // Generate URL slug from a publication title.
    function generateSlug(title) {
        return title
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .substring(0, 150)
            .replace(/-+$/g, "");
    }

    // Import publication metadata.
    button.addEventListener("click", async function () {

        const value = identifier.value.trim();

        if (!value) {
            status.textContent =
                "Please enter a DOI or arXiv identifier.";
            return;
        }

        button.disabled = true;
        button.textContent = "Importing...";
        status.textContent = "Fetching publication details...";

        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            20000
        );

        try {

            const query = new URLSearchParams({
                source: source.value,
                identifier: value
            });

            const response = await fetch(
                "/admin/publication/metadata?" + query.toString(),
                {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json"
                    },
                    signal: controller.signal
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                console.error(
                    "Unexpected server response:",
                    response.status,
                    await response.text()
                );

                throw new Error(
                    "Server returned HTTP " + response.status +
                    " instead of JSON. Check the Flask terminal."
                );
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Publication import failed."
                );
            }

            const publication = data.publication;

            if (!publication || !publication.title) {
                throw new Error(
                    "The metadata response does not contain a title."
                );
            }

            // Fill publication fields.
            setField("title", publication.title);
            setField("summary", publication.summary);
            setField("body", publication.body);
            setField("category", publication.category);
            setField("tags", publication.tags);
            setField("date", publication.date);
            setField("url", publication.url);

            // Update slug for the newly imported paper.
            setField("slug", generateSlug(publication.title));

            status.textContent =
                "Publication details imported successfully. " +
                "Review the information below and click Save Content.";

        } catch (error) {

            if (error.name === "AbortError") {
                status.textContent =
                    "Request timed out. Please try again.";
            } else {
                status.textContent =
                    "Import failed: " + error.message;
            }

            console.error("Publication import error:", error);

        } finally {

            clearTimeout(timeoutId);

            button.disabled = false;
            button.textContent = "Import Details ↗";

        }

    });

});
