/* =========================================================
   PLAYLIST ACTIONS
========================================================= */

const SAVED_CONTENTS_KEY =
    "mesbah_saved_contents";


/* =========================================================
   GET CONTENT
========================================================= */

async function getPlaylistContent(contentId) {

    const response =
        await fetch("data/contents2.xml");

    if (!response.ok) {
        throw new Error("خطا در دریافت محتوا");
    }

    const xmlText =
        await response.text();

    const xml =
        new DOMParser().parseFromString(
            xmlText,
            "application/xml"
        );

    return Array.from(
        xml.querySelectorAll("content")
    ).find(
        item =>
            item.getAttribute("id") === contentId
    );

}


/* =========================================================
   GET SAVED
========================================================= */

function getSavedContents() {

    try {

        return JSON.parse(
            localStorage.getItem(
                SAVED_CONTENTS_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


/* =========================================================
   SHARE
========================================================= */

async function sharePlaylistContent(contentId) {

    try {

        const content =
            await getPlaylistContent(contentId);

        if (!content) return;

        const title =
            content.querySelector("title")
                ?.textContent
                .trim() || "";

        const url =
            `${window.location.origin}` +
            `${window.location.pathname.replace(
                "playlist.html",
                "content.html"
            )}` +
            `?id=${encodeURIComponent(contentId)}`;

        if (navigator.share) {

            await navigator.share({
                title,
                text: title,
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
   DOWNLOAD
========================================================= */

async function downloadPlaylistContent(contentId) {

    try {

        const content =
            await getPlaylistContent(contentId);

        if (!content) return;

        const type =
            content.querySelector("type")
                ?.textContent
                .trim() || "";

        const mediaUrl =
            type === "video"
                ? content.querySelector("video")
                    ?.textContent.trim() || ""
                : content.querySelector("audio")
                    ?.textContent.trim() || "";


        if (!mediaUrl) {

            alert("فایل قابل دانلود پیدا نشد");
            return;

        }


        const response =
            await fetch(mediaUrl);

        if (!response.ok) {
            throw new Error("خطا در دریافت فایل");
        }


        const blob =
            await response.blob();

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            mediaUrl.split("/").pop();

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    } catch (error) {

        console.error(
            "PLAYLIST DOWNLOAD ERROR:",
            error
        );

    }

}


/* =========================================================
   SAVE
========================================================= */

function savePlaylistContent(
    button,
    contentId
) {

    let saved =
        getSavedContents();


    const icon =
        button.querySelector("i");


    if (saved.includes(contentId)) {

        saved =
            saved.filter(
                id => id !== contentId
            );

        button.classList.remove("saved");

        if (icon) {

            icon.className =
                "fa-regular fa-bookmark";

        }

        button.title =
            "ذخیره";

    }

    else {

        saved.push(contentId);

        button.classList.add("saved");

        if (icon) {

            icon.className =
                "fa-solid fa-bookmark";

        }

        button.title =
            "حذف از ذخیره‌ها";

    }


    localStorage.setItem(
        SAVED_CONTENTS_KEY,
        JSON.stringify(saved)
    );

}


/* =========================================================
   LOAD SAVE STATES
========================================================= */

function loadPlaylistSaveStates() {

    const saved =
        getSavedContents();

    document
        .querySelectorAll(
            ".playlist-action.save-action"
        )
        .forEach(button => {

            const contentId =
                button.dataset.contentId;

            if (!contentId) return;

            const icon =
                button.querySelector("i");


            if (saved.includes(String(contentId))) {

                button.classList.add("saved");

                if (icon) {

                    icon.className =
                        "fa-solid fa-bookmark";

                }

                button.title =
                    "حذف از ذخیره‌ها";

            } else {

                button.classList.remove("saved");

                if (icon) {

                    icon.className =
                        "fa-regular fa-bookmark";

                }

                button.title =
                    "ذخیره";

            }

        });

}


/* =========================================================
   EVENTS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".playlist-action"
            );


        if (!button) return;


        event.preventDefault();


        const contentId =
            button.dataset.contentId;


        if (!contentId) return;


        if (
            button.classList.contains(
                "share-button"
            )
        ) {

            sharePlaylistContent(
                contentId
            );

        }

        else if (
            button.classList.contains(
                "download-button"
            )
        ) {

            downloadPlaylistContent(
                contentId
            );

        }

        else if (
            button.classList.contains(
                "save-action"
            )
        ) {

            savePlaylistContent(
                button,
                contentId
            );

        }

    }
);


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPlaylistSaveStates();

    }
);