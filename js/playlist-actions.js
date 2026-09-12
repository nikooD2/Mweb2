/* =========================================================
   PLAYLIST ACTIONS
========================================================= */

const SAVED_CONTENTS_KEY =
    "mesbah_saved_contents";

const SAVED_PLAYLISTS_KEY =
    "mesbah_saved_playlists";

const HISTORY_PLAYLISTS_KEY =
    "mesbah_history_playlists";
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


        /* =========================
           CONTENT INFO
        ========================= */

        const title =
            content.querySelector("title")
                ?.textContent
                .trim() || "";

        const speaker =
            content.querySelector("speaker")
                ?.textContent
                .trim() || "";


        /* =========================
           CONTENT URL
        ========================= */

        const url =
            `${window.location.origin}` +
            `${window.location.pathname.replace(
                "playlist.html",
                "content.html"
            )}` +
            `?id=${encodeURIComponent(contentId)}`;


        /* =========================
           SHARE TEXT
        ========================= */

        let shareText =
            `«${title}»\n\n`;

        if (speaker) {

            shareText +=
                `گوینده: ${speaker}\n`;

        }

        shareText +=
            `لینک: ${url}`;


        /* =========================
           SHARE
        ========================= */

        if (navigator.share) {

            await navigator.share({

                title: title,

                text: shareText,

                url: url

            });

        } else {

            await navigator.clipboard.writeText(
                shareText
            );

            alert("اطلاعات و لینک کپی شد");

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
   PLAYLIST HEADER
========================================================= */

function getSavedPlaylists() {

    try {

        return JSON.parse(
            localStorage.getItem(
                SAVED_PLAYLISTS_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function savePlaylists(playlists) {

    localStorage.setItem(
        SAVED_PLAYLISTS_KEY,
        JSON.stringify(playlists)
    );

}


/* =========================================================
   SAVE PLAYLIST
========================================================= */

function savePlaylist(playlistId) {

    let saved =
        getSavedPlaylists();

    const id =
        String(playlistId);


    if (saved.includes(id)) {

        saved =
            saved.filter(
                item => item !== id
            );

    } else {

        saved.push(id);

    }


    savePlaylists(saved);

    updatePlaylistSaveButton();

}


/* =========================================================
   UPDATE SAVE BUTTON
========================================================= */

function updatePlaylistSaveButton() {

    const button =
        document.querySelector(
            ".playlist-save-button"
        );

    if (!button) return;


    const params =
        new URLSearchParams(
            window.location.search
        );

    const playlistId =
        params.get("id");


    if (!playlistId) return;


    const saved =
        getSavedPlaylists();

    const isSaved =
        saved.includes(
            String(playlistId)
        );


    const icon =
        button.querySelector("i");


    if (isSaved) {

        button.classList.add("saved");

        if (icon) {

            icon.className =
                "fa-solid fa-bookmark";

        }

        button.title =
            "حذف از مجموعه‌های ذخیره‌شده";

    } else {

        button.classList.remove("saved");

        if (icon) {

            icon.className =
                "fa-regular fa-bookmark";

        }

        button.title =
            "ذخیره مجموعه";

    }

}


/* =========================================================
   PLAYLIST HISTORY
========================================================= */

function addPlaylistToHistory(playlistId) {

    try {

        let history =
            JSON.parse(
                localStorage.getItem(
                    HISTORY_PLAYLISTS_KEY
                )
            ) || [];


        const id =
            String(playlistId);


        history =
            history.filter(
                item => item !== id
            );


        history.unshift(id);


        /*
         * فقط ۵۰ مجموعه اخیر
         */

        history =
            history.slice(0, 50);


        localStorage.setItem(
            HISTORY_PLAYLISTS_KEY,
            JSON.stringify(history)
        );


    } catch (error) {

        console.error(
            "PLAYLIST HISTORY ERROR:",
            error
        );

    }

}


/* =========================================================
   SHARE PLAYLIST
========================================================= */

async function sharePlaylist() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const playlistId =
        params.get("id");


    if (!playlistId) return;


    const title =
        document.querySelector(
            "#playlist-title"
        )?.textContent.trim()
        || "مجموعه";


    const url =
        `${window.location.origin}` +
        `${window.location.pathname}` +
        `?id=${encodeURIComponent(playlistId)}`;


    try {

        if (navigator.share) {

            await navigator.share({
                title,
                text: title,
                url
            });

        } else {

            await navigator.clipboard.writeText(
                url
            );

            alert("لینک مجموعه کپی شد");

        }

    } catch (error) {

        if (
            error.name !== "AbortError"
        ) {

            console.error(
                "PLAYLIST SHARE ERROR:",
                error
            );

        }

    }

}


/* =========================================================
   PLAYLIST HEADER EVENTS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const saveButton =
            event.target.closest(
                ".playlist-save-button"
            );


        if (saveButton) {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const playlistId =
                params.get("id");


            if (playlistId) {

                savePlaylist(
                    playlistId
                );

            }

            return;

        }


        const shareButton =
            event.target.closest(
                ".playlist-share-button"
            );


        if (shareButton) {

            sharePlaylist();

        }

    }
);


/* =========================================================
   PLAYLIST INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const playlistId =
            params.get("id");


        if (!playlistId) return;


        updatePlaylistSaveButton();

        addPlaylistToHistory(
            playlistId
        );

    }
);

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