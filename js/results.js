/* =========================================================
   RESULTS
========================================================= */


document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const type =
        params.get("type") || "newest";


    setResultsTitle(type);

    loadResults(type);

});
/* =========================================================
   SET RESULTS TITLE
========================================================= */

function setResultsTitle(type) {

    const title =
        document.querySelector("#results-title");

    if (!title) {
        return;
    }

    const titles = {

        newest: "تازه‌ها",

        popular: "پربازدیدترین‌ها"

    };

    title.textContent =
        titles[type] || "تازه‌ها";
}

/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults(type) {

    const files = {

        newest: "data/newest.xml",

        popular: "data/popular.xml",

        filtered: "data/filtered.xml"

    };


    const file =
        files[type] || files.newest;


    try {

        const response =
            await fetch(file);


        if (!response.ok) {

            throw new Error(
                `Failed to load ${file}`
            );

        }


        const xmlText =
            await response.text();


        const parser =
            new DOMParser();


        const xml =
            parser.parseFromString(
                xmlText,
                "application/xml"
            );


        const items =
            [...xml.querySelectorAll("item")];


        renderCards(items);


    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );

    }

}


/* =========================================================
   RENDER CARDS
========================================================= */

function renderCards(items) {

    const container =
        document.querySelector(".results-grid");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!items.length) {

        container.innerHTML = `
            <div class="results-empty">
                محتوایی برای نمایش پیدا نشد.
            </div>
        `;

        return;

    }


    items.forEach(item => {

        const title =
            item.querySelector("title")
                ?.textContent.trim() || "";


        const speaker =
            item.querySelector("speaker")
                ?.textContent.trim() || "";


        const type =
            item.querySelector("type")
                ?.textContent.trim() || "";


        const image =
            item.querySelector("image")
                ?.textContent.trim() || "";


        const card =
            document.createElement("article");


        card.className =
            "content-card";


        card.innerHTML = `

            <div class="content-card-image">

                <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                >

                <span class="content-type">
                    ${type}
                </span>

            </div>


            <div class="content-card-body">

                <h3>
                    ${title}
                </h3>

                <p>
                    ${speaker}
                </p>

            </div>

        `;


        container.appendChild(card);

    });

}