/* =========================================================
   CARD FACTORY
   ساخت کارت بر اساس type
========================================================= */

function createCard(item) {

    const itemType =
        getXMLValue(item, "type");


    switch (itemType) {

        case "video":
            return createVideoCard(item);

        case "audio":
            return createAudioCard(item);

        case "playlist":
            return createPlaylistCard(item);

        case "speaker":
            return createSpeakerCard(item);

        case "topic":
            return createTopicCard(item);

        default:
            return null;

    }

}


/* =========================================================
   GET XML VALUE
========================================================= */

function getXMLValue(item, tag) {

    return (
        item.querySelector(tag)
            ?.textContent
            .trim() || ""
    );

}


/* =========================================================
   VIDEO CARD
========================================================= */

function createVideoCard(item) {

    const id = item.getAttribute("id");

    const title =
        getXMLValue(item, "title");

    const speaker =
        getXMLValue(item, "speaker");

    const image =
        getXMLValue(item, "image");

    const duration =
        getXMLValue(item, "duration");


    const card =
        document.createElement("a");


    card.href =
        `content.html?id=${id}`;


    card.className =
        "content-card video-card";


    card.innerHTML = `

        <div class="content-card-image">

            <img
                src="${image}"
                alt="${title}"
            >

            <span class="video-play-icon">

                <i class="fa-solid fa-play"></i>

            </span>


            ${
                duration
                    ? `
                        <span class="video-duration">
                            ${duration}
                        </span>
                    `
                    : ""
            }

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


    return card;

}


/* =========================================================
   AUDIO CARD
========================================================= */

function createAudioCard(item) {

    const id = item.getAttribute("id");

    const title =
        getXMLValue(item, "title");

    const speaker =
        getXMLValue(item, "speaker");

    const image =
        getXMLValue(item, "image");


    const card =
        document.createElement("a");


    card.href =
        `content.html?id=${id}`;


    card.className =
        "content-card audio-card";


    card.innerHTML = `

        <div class="content-card-image">

            <img
                src="${image}"
                alt="${title}"
            >

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


    return card;

}


/* =========================================================
   PLAYLIST CARD
========================================================= */

function createPlaylistCard(item) {

    const id =
        item.getAttribute("id");


    const title =
        getXMLValue(item, "title");


    const description =
        getXMLValue(item, "description");


    const format =
        getXMLValue(item, "format");


    const image1 =
        getXMLValue(item, "image1");


    const image2 =
        getXMLValue(item, "image2");


    const image3 =
        getXMLValue(item, "image3");


    /* =========================================================
       FORMAT INFO
    ========================================================= */

    let formatIcon = "fa-solid fa-layer-group";
    let formatText = "";


    if (format === "audio") {

        formatIcon =
            "fa-solid fa-headphones";

        formatText =
            "صوتی";

    }

    else if (format === "video") {

        formatIcon =
            "fa-solid fa-video";

        formatText =
            "تصویری";

    }

    else if (format === "mixed") {

        formatIcon =
            "fa-solid fa-photo-film";

        formatText =
            "صوتی-تصویری";

    }


    /* =========================================================
       CREATE CARD
    ========================================================= */

    const card =
        document.createElement("a");


    card.href =
        `playlist.html?id=${id}`;


    card.className =
        "playlist-card";


    card.innerHTML = `

        <div class="playlist-image">

            <div class="playlist-images">

                <img
                    src="${image1}"
                    alt=""
                    aria-hidden="true"
                >

                <img
                    src="${image2}"
                    alt=""
                    aria-hidden="true"
                >

                <img
                    src="${image3}"
                    alt="${title}"
                >


                <span class="playlist-info">

                    <i class="${formatIcon}"></i>

                    <span>
                        ${formatText}
                    </span>

                </span>


                ${
                    description
                        ? `
                            <span class="playlist-hover-text">
                                ${description}
                            </span>
                        `
                        : ""
                }

            </div>

        </div>


        <h3>
            ${title}
        </h3>

    `;


    /* =========================================================
       MOBILE + TABLET CLICK
    ========================================================= */

    card.addEventListener("click", (event) => {

        /* فقط موبایل و تبلت */
        if (window.innerWidth > 1000) {
            return;
        }


        /* اگر اطلاعات هنوز نمایش داده نشده */
        if (!card.classList.contains("show-info")) {

            event.preventDefault();


            /* بستن اطلاعات کارت‌های دیگر */
            document
                .querySelectorAll(".playlist-card.show-info")
                .forEach(otherCard => {

                    otherCard.classList.remove("show-info");

                });


            /* نمایش اطلاعات این کارت */
            card.classList.add("show-info");

        }

        /*
        اگر show-info از قبل وجود داشته باشد،
        preventDefault اجرا نمی‌شود
        و لینک باز می‌شود.
        */

    });


    return card;

}


/* =========================================================
   SPEAKER CARD
========================================================= */

function createSpeakerCard(item) {

    const id = item.getAttribute("id");

    const name =
        getXMLValue(item, "title");

    const image =
        getXMLValue(item, "image");


    const card =
        document.createElement("a");


    card.href =
        `speaker.html?id=${id}`;


    card.className =
        "speaker-card";


    card.innerHTML = `

        <div class="speaker-image">

            <img
                src="${image}"
                alt="${name}"
            >

        </div>


        <h3>
            ${name}
        </h3>

    `;


    return card;

}


/* =========================================================
   TOPIC CARD
========================================================= */

function createTopicCard(item) {

    const id =
        item.getAttribute("id");

    const title =
        getXMLValue(item, "title");


    const card =
        document.createElement("a");


    /*
       با کلیک روی کارت دسته‌بندی
       به صفحه نتایج می‌رویم
       و اسم خود کارت را همراه لینک می‌فرستیم
    */

    card.href =
        `results.html?topic=${encodeURIComponent(title)}`;


    card.className =
        "topic-card";


    card.innerHTML = `

        <h3>
            ${title}
        </h3>

    `;


    return card;

}

