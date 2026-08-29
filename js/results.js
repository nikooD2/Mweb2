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

        newest:
            "تازه‌ها",

        popular:
            "محبوب‌ترین‌ها",

        "popular-video":
            "محبوب‌ترین‌ها",

        "popular-audio":
            "محبوب‌ترین‌ها",

        upcoming:
            "مناسبت‌های پیش‌رو",
        "upcoming-video":
            "مناسبت‌های پیش‌رو",
        "upcoming-audio":
            "مناسبت‌های پیش‌رو",
        filtered:
            "نتایج جستجو"

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


    const baseType =
    type === "newest-video" ||
    type === "newest-audio"
        ? "newest"
        : type;


    const file =
        files[baseType] || files.newest;


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


        renderResults(items, type)


    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );

    }

}


/* =========================================================
   RENDER RESULTS
========================================================= */

function renderResults(items, resultType) {

    const container =
        document.querySelector(".results-grid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const videos = [];
    const audios = [];

    items.forEach(item => {

        const itemType =
            getXMLValue(item, "type");

        if (itemType === "video") {
            videos.push(item);
        }

        else if (itemType === "audio") {
            audios.push(item);
        }

    });


    /* =========================================
       تعیین تب فعال
    ========================================= */

    const videoOnly =
        resultType.endsWith("-video");

    const audioOnly =
        resultType.endsWith("-audio");


    /* =========================================
       ویدئوها
    ========================================= */

    if (videos.length) {

        container.appendChild(
            createResultsSection(
                "ویدئوها",
                videos,
                "video",

                // اگر video-only بود باز
                // در غیر این صورت اگر audio-only بود بسته
                !audioOnly
            )
        );

    }


    /* =========================================
       صوت‌ها
    ========================================= */

    if (audios.length) {

        container.appendChild(
            createResultsSection(
                "صوت‌ها",
                audios,
                "audio",

                // اگر audio-only بود باز
                // در غیر این صورت اگر video-only بود بسته
                !videoOnly
            )
        );

    }


    if (
        !videos.length &&
        !audios.length
    ) {

        container.innerHTML = `
            <div class="results-empty">
                محتوایی برای نمایش پیدا نشد.
            </div>
        `;

    }

}


/* =========================================================
   CREATE RESULTS SECTION
========================================================= */

function createResultsSection(
    title,
    items,
    sectionType,
    isOpen = true
) {

    const section =
        document.createElement("section");


    section.className =
        `results-section results-${sectionType}-section` +
        (isOpen ? " is-open" : "");


    /* =========================================
       HEADER
    ========================================= */

    const header =
        document.createElement("button");


    header.type = "button";

    header.className =
        "results-section-header";

    header.setAttribute(
        "aria-expanded",
        isOpen
    );


    header.innerHTML = `

        <div class="results-section-title">

            <h2>
                ${title}
            </h2>

            <span class="results-count">
                ${items.length} نتیجه
            </span>

        </div>


        <i class="
            fa-solid
            ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}
            results-section-arrow
        "></i>
    `;


    /* =========================================
       CONTENT
    ========================================= */

    const content =
        document.createElement("div");


    content.className =
        "results-section-content";


    /* =========================================
       GRID
    ========================================= */

    const grid =
        document.createElement("div");


    grid.className =
        `results-items-grid results-${sectionType}-grid`;


    /* =========================================
       تعداد اولیه
    ========================================= */

    const initialCount =
        sectionType === "video"
            ? 8
            : 12;


    let visibleCount =
        Math.min(
            initialCount,
            items.length
        );


    renderSectionItems(
        grid,
        items,
        visibleCount
    );


    content.appendChild(grid);


    // =========================================
    // نمایش نتایج بیشتر / کمتر
    // =========================================

    if (items.length > visibleCount) {

        const moreButton =
            document.createElement("button");

        moreButton.type = "button";

        moreButton.className =
            "results-more-btn";

        moreButton.innerHTML = `

            <span>
                نمایش نتایج بیشتر
            </span>

            <i class="
                fa-solid
                fa-chevron-down
            "></i>

        `;


        moreButton.addEventListener(
            "click",
            () => {

                /* اگر هنوز همه نتایج نمایش داده نشده */
                if (visibleCount < items.length) {

                    visibleCount =
                        Math.min(
                            visibleCount + initialCount,
                            items.length
                        );

                    renderSectionItems(
                        grid,
                        items,
                        visibleCount,
                    );


                    /* اگر همه نتایج نمایش داده شد */
                    if (
                        visibleCount >=
                        items.length
                    ) {

                        moreButton.querySelector("span")
                            .textContent =
                            "نمایش نتایج کمتر";

                        moreButton.querySelector("i")
                            .className =
                            "fa-solid fa-chevron-up";
                    }

                }

                /* اگر همه نمایش داده شده، برگرد به حالت اولیه */
                else {

                    visibleCount =
                        initialCount;

                    renderSectionItems(
                        grid,
                        items,
                        visibleCount,
                    );


                    moreButton.querySelector("span")
                        .textContent =
                        "نمایش نتایج بیشتر";

                    moreButton.querySelector("i")
                        .className =
                        "fa-solid fa-chevron-down";
                }

            }
        );


        content.appendChild(
            moreButton
        );
    }


    /* =========================================
       باز و بسته شدن
    ========================================= */

    header.addEventListener("click", () => {

        const isOpen =
            section.classList.toggle("is-open");


        header.setAttribute(
            "aria-expanded",
            isOpen
        );


        const arrow =
            header.querySelector(
                ".results-section-arrow"
            );


        arrow.classList.toggle(
            "fa-chevron-up",
            isOpen
        );


        arrow.classList.toggle(
            "fa-chevron-down",
            !isOpen
        );

    });


    section.appendChild(header);

    section.appendChild(content);


    return section;

}


/* =========================================================
   RENDER SECTION ITEMS
========================================================= */

function renderSectionItems(
    grid,
    items,
    visibleCount
) {

    grid.innerHTML = "";

    items
        .slice(0, visibleCount)
        .forEach(item => {

            const card =
                createCard(item);

            if (card) {
                grid.appendChild(card);
            }

        });

}
