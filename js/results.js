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


    const params =
        new URLSearchParams(
            window.location.search
        );


    const topic =
    params.get("topic");

    const topicTitle =
        params.get("topicTitle");

    const speaker =
        params.get("speaker");

    const format =
        params.get("format");



    /* =====================================================
    عنوان دسته‌بندی که از کارت آمده
    ===================================================== */

    if (topicTitle) {

        title.textContent =
            `تازه‌ها درباره ${topicTitle}`;

        return;

    }
    /* =====================================================
       نام فارسی موضوعات
    ===================================================== */
    const topicNames = {

        quran:
            "قرآن",

        ahlulbayt:
            "چهارده معصوم",

        prophets:
            "پیامبران",

        hadith:
            "حدیث",

        history:
            "تاریخ",

        seerah:
            "سیره",

        arabic:
            "قواعد عربی",

        aqeedah:
            "کلام و عقاید",

        fiqh:
            "فقه و احکام",

        ethics:
            "اخلاق",

        family:
            "خانواده",

        "islamic-sciences":
            "علوم اسلامی"

    };


    /* =====================================================
       نام سخنران‌ها
    ===================================================== */

    const speakerNames = {

        speaker1:
            "سخنران 1",

        speaker2:
            "سخنران 2",

        speaker3:
            "سخنران 3"

    };


    const topicName =
        topic
            ? (topicNames[topic] || topic)
            : "";


    const speakerName =
        speaker
            ? (speakerNames[speaker] || speaker)
            : "";


    /* =====================================================
       اگر موضوع + سخنران
    ===================================================== */

    if (topicName && speakerName) {

        title.textContent =
            `تازه‌ها درباره ${topicName} از ${speakerName}`;

        return;

    }


    /* =====================================================
       اگر فقط موضوع
    ===================================================== */

    if (topicName) {

        title.textContent =
            `تازه‌ها درباره ${topicName}`;

        return;

    }


    /* =====================================================
       اگر فقط سخنران
    ===================================================== */

    if (speakerName) {

        title.textContent =
            `تازه‌ها از ${speakerName}`;

        return;

    }


    /* =====================================================
       اگر فقط قالب انتخاب شده
    ===================================================== */

    if (format === "video") {

        title.textContent =
            "تازه‌ترین ویدیوها";

        return;

    }


    if (format === "audio") {

        title.textContent =
            "تازه‌ترین صوت‌ها";

        return;

    }


    /* =====================================================
       عنوان عادی بر اساس type
    ===================================================== */

    const titles = {

        newest:
            "تازه‌ها",

        "newest-video":
            "تازه‌ترین ویدیوها",

        "newest-audio":
            "تازه‌ترین صوت‌ها",
        
        "newest-playlist":
            "تازه‌ترین مجموعه‌ها",

        popular:
            "پربازدیدها",

        "popular-video":
            "پربازدیدترین ویدیوها",

        "popular-audio":
            "پربازدیدترین صوت‌ها",

        upcoming:
            "مناسبت‌های پیش‌رو",

        "upcoming-video":
            "مناسبت‌های پیش‌رو - ویدیوها",

        "upcoming-audio":
            "مناسبت‌های پیش‌رو - صوت‌ها",

        filtered:
            "نتایج فیلتر",
        saved:
            "ذخیره‌ها",

        history:
            "تاریخچه"
        };


    title.textContent =
        titles[type] || "نتایج";

}


/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults(type) {

    const file =
        "data/contents2.xml";


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


        /* =========================================
           بررسی خطای XML
        ========================================= */

        const parserError =
            xml.querySelector("parsererror");


        if (parserError) {

            throw new Error(
                "ساختار XML صحیح نیست."
            );

        }


        /* =========================================
           همه محتواها
        ========================================= */

        const items =
            [...xml.querySelectorAll("content")];


        /* =========================================
        PLAYLISTS
        ========================================= */

        let playlists = [];

        try {

            const playlistResponse =
                await fetch("data/playlists.xml");


            if (playlistResponse.ok) {

                const playlistText =
                    await playlistResponse.text();


                const playlistXML =
                    parser.parseFromString(
                        playlistText,
                        "application/xml"
                    );


                playlists =
                    [
                        ...playlistXML.querySelectorAll("content")
                    ];

            }

        } catch (error) {

            console.error(
                "Error loading playlists:",
                error
            );

        }


        /* =========================================
           فقط برای تعیین پنجره باز/بسته
        ========================================= */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const format =
            params.get("format");


        /* =========================================
           نمایش
        ========================================= */

        renderResults(
            items,
            playlists,
            type,
            format
        );


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

function renderResults(
    items,
    playlists,
    resultType,
    format
) {

    const container =
        document.querySelector(".results-grid");


    if (!container) {
        return;
    }


    container.innerHTML = "";

    /* =========================================================
    تاریخچه
    ========================================================= */

    if (resultType === "history") {

        let historyIds = [];

        try {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        "mesbah_history"
                    ) || "[]"
                );

            historyIds =
                history.map(item => {

                    if (
                        typeof item === "object" &&
                        item !== null
                    ) {
                        return String(item.id);
                    }

                    return String(item);

                });

        } catch {

            historyIds = [];

        }


        /*
        ترتیب XML را نادیده می‌گیریم.
        ترتیب تاریخچه را حفظ می‌کنیم:
        جدیدترین مشاهده → قدیمی‌تر
        */

        const historyItems =
            historyIds
                .map(id =>
                    items.find(
                        item =>
                            item.getAttribute("id") === id
                    )
                )
                .filter(Boolean);


        /*
        حالا همان ساختار معمول Results
        را برای تاریخچه استفاده می‌کنیم.
        */

        const videos = [];
        const audios = [];

        historyItems.forEach(item => {

            const itemType =
                getXMLValue(
                    item,
                    "type"
                );

            if (itemType === "video") {

                videos.push(item);

            }

            else if (itemType === "audio") {

                audios.push(item);

            }

        });


        /*
        تب/فیلتر فعلی Results
        تعیین می‌کند چه چیزی نمایش داده شود.
        */

        let showVideo = false;
        let showAudio = false;

        if (format === "video") {

            showVideo = true;

        }

        else if (format === "audio") {

            showAudio = true;

        }

        else {

            showVideo = true;
            showAudio = true;

        }


        if (showVideo && videos.length) {

            container.appendChild(
                createResultsSection(
                    "ویدئوها",
                    videos,
                    "video",
                    true
                )
            );

        }


        if (showAudio && audios.length) {

            container.appendChild(
                createResultsSection(
                    "صوت‌ها",
                    audios,
                    "audio",
                    true
                )
            );

        }


        if (
            !videos.length &&
            !audios.length
        ) {

            container.innerHTML = `
                <div class="results-empty">
                    هنوز محتوایی مشاهده نکرده‌اید.
                </div>
            `;

        }

        return;
    }
    
    /* =========================================
    ذخیره‌ها
    ========================================= */

    if (resultType === "saved") {

        let savedIds = [];

        try {

            savedIds =
                JSON.parse(
                    localStorage.getItem(
                        "mesbah_saved_contents"
                    ) || "[]"
                );

        } catch {

            savedIds = [];

        }


        /* فقط محتواهای ذخیره‌شده */

        const savedItems =
            savedIds
                .map(id =>
                    items.find(
                        item =>
                            item.getAttribute("id") === String(id)
                    )
                )
                .filter(Boolean);


        const savedVideos = [];
        const savedAudios = [];


        savedItems.forEach(item => {

            const itemType =
                getXMLValue(
                    item,
                    "type"
                );


            if (itemType === "video") {

                savedVideos.push(item);

            }

            else if (itemType === "audio") {

                savedAudios.push(item);

            }

        });


        /* =========================================
        ویدئوهای ذخیره‌شده
        ========================================= */

        if (savedVideos.length) {

            container.appendChild(

                createResultsSection(
                    "ویدئوها",
                    savedVideos,
                    "video",
                    true
                )

            );

        }


        /* =========================================
        صوت‌های ذخیره‌شده
        ========================================= */

        if (savedAudios.length) {

            container.appendChild(

                createResultsSection(
                    "صوت‌ها",
                    savedAudios,
                    "audio",
                    true
                )

            );

        }


        /* =========================================
        بدون ذخیره
        ========================================= */

        if (
            !savedVideos.length &&
            !savedAudios.length
        ) {

            container.innerHTML = `

                <div class="results-empty">

                    هنوز محتوایی ذخیره نکرده‌اید.

                </div>

            `;

        }


        return;
    }

    const videos = [];
    const audios = [];
    const playlistItems = playlists;


    /* =========================================
       جدا کردن محتوا فقط برای نمایش در پنجره مربوطه
       این فیلتر جستجو نیست
    ========================================= */

    items.forEach(item => {

        const itemType =
            getXMLValue(
                item,
                "type"
            );


        if (itemType === "video") {

            videos.push(item);

        }

        else if (itemType === "audio") {

            audios.push(item);

        }

    });
    /* =========================================
    تعیین پنجره‌های قابل نمایش
    ========================================= */

    let showVideo = false;
    let showAudio = false;
    let showPlaylist = false;


    /* =========================================
    لیست پخش
    ========================================= */

    if (resultType === "playlist") {

        showPlaylist = true;

    }


    /* =========================================
    ویدیو
    ========================================= */

    else if (
        resultType.endsWith("-video") ||
        format === "video"
    ) {

        showVideo = true;

    }


    /* =========================================
    صوت
    ========================================= */

    else if (
        resultType.endsWith("-audio") ||
        format === "audio"
    ) {

        showAudio = true;

    }

    else if (
        resultType.endsWith("-playlist") ||
        format === "playlist"
    ) {

        showPlaylist = true;

    }

    /* =========================================
    حالت عادی
    newest / popular / ...
    ========================================= */

    else {
        showVideo = true;
        showAudio = true;
        showPlaylist = true;
    }

    /* =========================================
    لیست‌های پخش
    ========================================= */

    if (showPlaylist && playlistItems.length) {

        container.appendChild(

            createResultsSection(
                "مجموعه‌ها",
                playlistItems,
                "playlist",
                true
            )

        );

    }


    /* =========================================
    ویدئوها
    ========================================= */

    if (showVideo && videos.length) {

        container.appendChild(

            createResultsSection(
                "ویدئوها",
                videos,
                "video",
                true
            )

        );

    }


    /* =========================================
    صوت‌ها
    ========================================= */

    if (showAudio && audios.length) {

        container.appendChild(

            createResultsSection(
                "صوت‌ها",
                audios,
                "audio",
                true
            )

        );

    }

    /* =========================================
    اگر فقط یک سکشن وجود داشت، هدرش مخفی شود
    ========================================= */

    const sections =
        container.querySelectorAll(".results-section");

    if (sections.length === 1) {

        sections[0]
            .querySelector(".results-section-header")
            ?.remove();

    }
    /* =========================================
       بدون محتوا
    ========================================= */

    if (
        !videos.length &&
        !audios.length &&
        !playlistItems.length
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

           <!-- <span class="results-count">
                ${items.length} نتیجه
            </span> -->

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

    const initialCount = 12
        // sectionType === "video"
        //     ? 8
        //     : sectionType === "audio"
        //         ? 12
        //         : 8;


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
