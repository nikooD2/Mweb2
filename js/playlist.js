document.addEventListener("DOMContentLoaded", () => {
    loadPlaylistPage();
});

/* =========================================================
   DATA
   تمام خواندن اطلاعات از فایل در این بخش انجام می‌شود
========================================================= */

async function loadPlaylistData() {

    const response =
        await fetch("data/playlists.xml");

    if (!response.ok) {
        throw new Error("خطا در دریافت playlists.xml");
    }

    const text =
        await response.text();

    return new DOMParser().parseFromString(
        text,
        "application/xml"
    );
}


async function loadContentsData() {

    const response =
        await fetch("data/contents2.xml");

    if (!response.ok) {
        throw new Error("خطا در دریافت contents2.xml");
    }

    const text =
        await response.text();

    return new DOMParser().parseFromString(
        text,
        "application/xml"
    );
}
/* =========================================================
   LOAD PLAYLIST PAGE
========================================================= */

async function loadPlaylistPage() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const playlistId =
            params.get("id");

        if (!playlistId) {
            console.error("شناسه پلی‌لیست پیدا نشد.");
            return;
        }

const shareButton =
    document.querySelector(".playlist-share-button");

if (shareButton) {

    shareButton.onclick = () => {
        sharePlaylist(playlistId);
    };

}

        /* =====================================================
           LOAD PLAYLIST INFO
        ===================================================== */

        const playlistXML =
            await loadPlaylistData();


        const playlist =
            Array.from(
                playlistXML.querySelectorAll("playlist")
            ).find(
                item =>
                    item.getAttribute("id") === playlistId
            );


        if (!playlist) {

            console.error(
                `پلی‌لیست با id=${playlistId} پیدا نشد.`
            );

            return;
        }


        /* =====================================================
           PLAYLIST INFO
        ===================================================== */

        const title =
            playlist.querySelector("title")
                ?.textContent
                .trim() || "عنوان مجموعه";


        const image1 =
            playlist.querySelector("image1")
                ?.textContent
                .trim() || "";


        const format =
            playlist.querySelector("format")
                ?.textContent
                .trim() || "";


        const audioCount =
            playlist.querySelector("count audio")
                ?.textContent
                .trim() || "0";


        const videoCount =
            playlist.querySelector("count video")
                ?.textContent
                .trim() || "0";


        let countText = "";


        if (format === "audio") {

            countText =
                `${audioCount} صوت`;

        }
        else if (format === "video") {

            countText =
                `${videoCount} ویدیو`;

        }
        else if (format === "mixed") {

            countText =
                `${audioCount} صوت · ${videoCount} ویدیو`;

        }


        /* =====================================================
           نمایش اطلاعات پلی‌لیست
        ===================================================== */

        const titleElement =
            document.querySelector("#playlist-title");

        if (titleElement) {
            titleElement.textContent = title;
        }


        const coverElement =
            document.querySelector("#playlist-cover");

        if (coverElement && image1) {
            coverElement.src = image1;
            coverElement.alt = title;
        }


        const countElement =
            document.querySelector("#playlist-count");

        if (countElement) {
            countElement.textContent = countText;
        }


        /* =====================================================
           LOAD CONTENTS
        ===================================================== */

        const contentXML =
            await loadContentsData();


        const contents =
            Array.from(
                contentXML.querySelectorAll("content")
            );


        /* =====================================================
           PLAYLIST CONTENT IDS
           آیدی‌ها از خود playlists.xml خوانده می‌شوند
        ===================================================== */

        const playlistContentIds =
            Array.from(
                playlist.querySelectorAll(
                    "contents > content"
                )
            )
            .map(
                item =>
                    item.getAttribute("id")
            )
            .filter(Boolean);


        /* =====================================================
           پیدا کردن محتواها بر اساس ID
        ===================================================== */

        const playlistContents =
            playlistContentIds
                .map(id =>
                    contents.find(
                        content =>
                            content.getAttribute("id") === id
                    )
                )
                .filter(Boolean);


        /* =====================================================
           RENDER
        ===================================================== */

        renderPlaylistContents(
            playlistContents
        );


    } catch (error) {

        console.error(
            "Error loading playlist:",
            error
        );

    }

}

/* =========================================================
   SHARE PLAYLIST
========================================================= */

async function sharePlaylist(playlistId) {

    try {

        const playlistXML =
            await loadPlaylistData();

        const playlist =
            Array.from(
                playlistXML.querySelectorAll("playlist")
            ).find(
                item =>
                    item.getAttribute("id") === playlistId
            );

        if (!playlist) return;


        const title =
            playlist.querySelector("title")
                ?.textContent
                .trim() || "";


        const description =
            playlist.querySelector("description")
                ?.textContent
                .trim() || "";


        const url =
            `${window.location.origin}` +
            `${window.location.pathname}` +
            `?id=${encodeURIComponent(playlistId)}`;


        if (navigator.share) {

            await navigator.share({

                title,

                text:
                    description
                        ? `${title}\n${description}`
                        : title,

                url

            });

        } else {

            await navigator.clipboard.writeText(url);

            alert("لینک کپی شد");

        }


    } catch (error) {

        console.error(
            "PLAYLIST SHARE ERROR:",
            error
        );

    }

}

/* =========================================================
   RENDER CONTENTS
========================================================= */

function renderPlaylistContents(contents) {

    const container =
        document.getElementById("playlist-content");


    if (!container) {

        console.error(
            "playlist-content پیدا نشد."
        );

        return;
    }


    container.innerHTML = "";


    contents.forEach(content => {

        const id =
            content.getAttribute("id");


        const title =
            content.querySelector("title")
                ?.textContent
                .trim() || "";


        const speaker =
            content.querySelector("speaker")
                ?.textContent
                .trim() || "";


        const type =
            content.querySelector("type")
                ?.textContent
                .trim() || "";


        const duration =
            content.querySelector("duration")
                ?.textContent
                .trim() || "";


        const image =
            content.querySelector("cover")
                ?.textContent
                .trim()
            ||
            content.querySelector("image")
                ?.textContent
                .trim()
            ||
            "";


        const typeText =
            type === "video"
                ? "ویدئو"
                : "صوت";


        const typeIcon =
            type === "video"
                ? "fa-video"
                : "fa-headphones";


        const card =
            document.createElement("div");


        card.className =
            "playlist-content-item";


        card.innerHTML = `

            <div class="playlist-content-cover">

                <img
                    src="${image}"
                    alt="${title}"
                >

            </div>


            <div class="playlist-content-info">

<div class="playlist-content-title">
    <span class="playlist-title-text">${title}</span>
</div>

                <div class="playlist-content-speaker">
                    ${speaker}
                </div>

                <div class="playlist-content-meta">

                    <span>
                        <i class="fa-solid ${typeIcon}"></i>
                        ${typeText}
                    </span>

                    ${
                        duration
                            ? `
                                <span>
                                    <i class="fa-regular fa-clock"></i>
                                    ${duration}
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="playlist-content-actions">

                <button
                    type="button"
                    class="playlist-action share-button"
                    data-content-id="${id}"
                    title="اشتراک‌گذاری"
                >
                    <i class="fa-solid fa-share-nodes"></i>
                </button>

                <button
                    type="button"
                    class="playlist-action download-button"
                    data-content-id="${id}"
                    title="دانلود"
                >
                    <i class="fa-solid fa-download"></i>
                </button>

                <button
                    type="button"
                    class="playlist-action save-action"
                    data-content-id="${id}"
                    title="ذخیره"
                >
                    <i class="fa-regular fa-bookmark"></i>
                </button>

            </div>

        `;


        /* =====================================================
           CLICK CARD
        ===================================================== */

        card.addEventListener("click", event => {

            if (event.target.closest(".playlist-action")) {
                return;
            }

            if (!id) return;

            window.location.href =
                `content.html?id=${encodeURIComponent(id)}`;

        });


        container.appendChild(card);

const titleElement =
    card.querySelector(".playlist-content-title");

const titleText =
    card.querySelector(".playlist-title-text");

if (titleElement && titleText) {

    requestAnimationFrame(() => {

        const textWidth =
            titleText.scrollWidth;

        const containerWidth =
            titleElement.clientWidth;


        if (textWidth > containerWidth) {

            /* چند فاصله به انتهای عنوان */

            titleText.textContent =
                  title + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                + title + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                + title + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                + title + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                + title;


            titleElement.classList.add("is-long");

        }

    });

}

        loadPlaylistSaveStates();

    });
}
