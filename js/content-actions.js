/* =========================================================
   XML HELPER
========================================================= */

function getText(element, tagName) {

    return (
        element
            ?.querySelector(tagName)
            ?.textContent
            .trim() || ""
    );

}


/* =========================================================
   CONTENT ID
========================================================= */

function getContentId(button) {

    return (
        button.dataset.contentId ||
        new URLSearchParams(
            window.location.search
        ).get("id") ||
        ""
    );

}


/* =========================================================
   FIND CONTENT FROM XML
========================================================= */

async function getContentById(contentId) {

    const response =
        await fetch("data/contents2.xml");

    if (!response.ok) {

        throw new Error(
            "XML پیدا نشد."
        );

    }

    const xmlText =
        await response.text();

    const xml =
        new DOMParser().parseFromString(
            xmlText,
            "application/xml"
        );

    const content =
        Array.from(
            xml.querySelectorAll("content")
        ).find(
            item =>
                item.getAttribute("id") ===
                String(contentId)
        );

    if (!content) {

        throw new Error(
            "محتوا پیدا نشد."
        );

    }

    return content;

}


/* =========================================================
   WEB SHARE
========================================================= */

async function handleShare(button) {

    try {

        const contentId =
            getContentId(button);

        if (!contentId) {
            console.warn(
                "SHARE: content ID پیدا نشد."
            );
            return;
        }


        /* =========================
           FIND CONTENT
        ========================= */

        const content =
            await getContentById(
                contentId
            );


        /* =========================
           CONTENT INFO
        ========================= */

        const title =
            getText(
                content,
                "title"
            );

        const speaker =
            getText(
                content,
                "speaker"
            );

        const type =
            getText(
                content,
                "type"
            );


        /* =========================
           DETERMINE MEDIA
        ========================= */

        const audioActions =
            button.closest(
                ".audio-actions"
            );

        let mediaUrl = "";
        let mediaType = "";


        if (audioActions) {

            mediaUrl =
                getText(
                    content,
                    "audio"
                );

            mediaType = "audio";

        }

        else {

            if (type === "video") {

                mediaUrl =
                    getText(
                        content,
                        "video"
                    );

                mediaType = "video";

            }

            else if (type === "audio") {

                mediaUrl =
                    getText(
                        content,
                        "audio"
                    );

                mediaType = "audio";

            }

        }


        if (!mediaUrl) {

            alert(
                "فایل قابل اشتراک پیدا نشد."
            );

            return;
        }


        /* =========================
           PAGE URL
        ========================= */

        const pageUrl =
            window.location.href;


        /* =========================
           SHARE TEXT
        ========================= */

        let shareText =
            `«${title}»\n\n`;


        if (speaker) {

            shareText +=
                `گوینده: ${speaker}\n\n`;

        }


        shareText +=
            `از سامانه مصباح\n`;

        shareText +=
            pageUrl;


        /* =========================
           GET MEDIA
        ========================= */

        const mediaResponse =
            await fetch(
                mediaUrl
            );


        if (!mediaResponse.ok) {

            throw new Error(
                "فایل رسانه‌ای پیدا نشد."
            );

        }


        const blob =
            await mediaResponse.blob();


        /* =========================
           FILE NAME
        ========================= */

        let fileName =
            mediaUrl
                .split("/")
                .pop()
                .split("?")[0];


        if (!fileName) {

            fileName =
                mediaType === "video"
                    ? "mesbah-video.mp4"
                    : "mesbah-audio.mp3";

        }


        /* =========================
           CREATE FILE
        ========================= */

        const mediaFile =
            new File(
                [blob],
                fileName,
                {
                    type:
                        blob.type ||
                        (
                            mediaType === "video"
                                ? "video/mp4"
                                : "audio/mpeg"
                        )
                }
            );


        /* =========================
           SHARE FILE
        ========================= */

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [mediaFile]
            })
        ) {

            await navigator.share({

                title: title,

                text: shareText,

                files: [mediaFile]

            });

            return;
        }


        /* =========================
           SHARE WITHOUT FILE
        ========================= */

        if (navigator.share) {

            await navigator.share({

                title: title,

                text: shareText,

                url: pageUrl

            });

            return;
        }


        alert(
            "اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود."
        );

    }

    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {
            return;
        }

        console.error(
            "SHARE ERROR:",
            error
        );

    }

}


/* =========================================================
   DOWNLOAD
========================================================= */

async function handleDownload(button) {

    try {

        const contentId =
            getContentId(button);

        if (!contentId) {

            console.warn(
                "DOWNLOAD: content ID پیدا نشد."
            );

            return;
        }


        /* =========================
           FIND CONTENT
        ========================= */

        const content =
            await getContentById(
                contentId
            );


        const type =
            getText(
                content,
                "type"
            );


        /* =========================
           DETERMINE MEDIA
        ========================= */

        const audioActions =
            button.closest(
                ".audio-actions"
            );

        let mediaUrl = "";


        if (audioActions) {

            mediaUrl =
                getText(
                    content,
                    "audio"
                );

        }

        else {

            if (type === "video") {

                mediaUrl =
                    getText(
                        content,
                        "video"
                    );

            }

            else if (type === "audio") {

                mediaUrl =
                    getText(
                        content,
                        "audio"
                    );

            }

        }


        if (!mediaUrl) {

            alert(
                "فایل قابل دانلود پیدا نشد."
            );

            return;
        }


        /* =========================
           DOWNLOAD MEDIA
        ========================= */

        const mediaResponse =
            await fetch(
                mediaUrl
            );


        if (!mediaResponse.ok) {

            throw new Error(
                "فایل رسانه‌ای پیدا نشد."
            );

        }


        const blob =
            await mediaResponse.blob();


        /* =========================
           FILE NAME
        ========================= */

        let fileName =
            mediaUrl
                .split("/")
                .pop()
                .split("?")[0];


        if (!fileName) {

            fileName =
                type === "video"
                    ? "mesbah-video.mp4"
                    : "mesbah-audio.mp3";

        }


        /* =========================
           CREATE DOWNLOAD
        ========================= */

        const blobUrl =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            blobUrl;

        link.download =
            fileName;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            blobUrl
        );

    }

    catch (error) {

        console.error(
            "DOWNLOAD ERROR:",
            error
        );

        alert(
            "دانلود فایل با خطا مواجه شد."
        );

    }

}
/* =========================================================
   HISTORY STORAGE
========================================================= */

const HistoryStorage = {

    key: "mesbah_history",

    get() {

        try {

            const data =
                localStorage.getItem(this.key);

            if (!data) {
                return [];
            }

            const history =
                JSON.parse(data);

            return Array.isArray(history)
                ? history
                : [];

        }

        catch (error) {

            console.error(
                "HISTORY GET ERROR:",
                error
            );

            return [];

        }

    },


    set(history) {

        try {

            localStorage.setItem(
                this.key,
                JSON.stringify(history)
            );

        }

        catch (error) {

            console.error(
                "HISTORY SET ERROR:",
                error
            );

        }

    },


    add(contentId) {

        contentId =
            String(contentId);

        let history =
            this.get();


        /* اگر قبلاً دیده شده، حذفش کن */

        history =
            history.filter(
                item =>
                    String(item.id) !== contentId
            );


        /* اضافه کردن به ابتدای تاریخچه */

        history.unshift({

            id: contentId,

            time: Date.now()

        });


        this.set(history);

    },


    clear() {

        localStorage.removeItem(
            this.key
        );

    }

};
/* =========================================================
   ADD CURRENT CONTENT TO HISTORY
========================================================= */

function addCurrentContentToHistory() {

    const contentId =
        new URLSearchParams(
            window.location.search
        ).get("id");

    if (!contentId) {
        return;
    }

    HistoryStorage.add(
        contentId
    );

}
/* =========================================================
   SAVE STORAGE
========================================================= */

const SaveStorage = {

    key:
        "mesbah_saved_contents",


    get() {

        try {

            const data =
                localStorage.getItem(
                    this.key
                );


            if (!data) {
                return [];
            }


            const ids =
                JSON.parse(data);


            return Array.isArray(ids)
                ? ids.map(String)
                : [];

        }

        catch (error) {

            console.error(
                "SAVE STORAGE GET ERROR:",
                error
            );

            return [];

        }

    },


    set(ids) {

        try {

            localStorage.setItem(
                this.key,
                JSON.stringify(ids)
            );

        }

        catch (error) {

            console.error(
                "SAVE STORAGE SET ERROR:",
                error
            );

        }

    },


    add(contentId) {

        contentId =
            String(contentId);


        const ids =
            this.get();


        if (!ids.includes(contentId)) {

            ids.push(
                contentId
            );

        }


        this.set(ids);

    },


    remove(contentId) {

        contentId =
            String(contentId);


        const ids =
            this.get();


        const newIds =
            ids.filter(
                id =>
                    id !== contentId
            );


        this.set(
            newIds
        );

    },


    has(contentId) {

        contentId =
            String(contentId);


        return this
            .get()
            .includes(contentId);

    },


    clear() {

        localStorage.removeItem(
            this.key
        );

    }

};


/* =========================================================
   UPDATE SAVE BUTTON
========================================================= */

function updateSaveButton(
    button,
    saved
) {

    const icon =
        button.querySelector("i");


    if (!icon) {
        return;
    }


    if (saved) {

        button.classList.add(
            "saved"
        );


        icon.classList.remove(
            "fa-regular"
        );


        icon.classList.add(
            "fa-solid"
        );


        button.title =
            "ذخیره شد";

    }

    else {

        button.classList.remove(
            "saved"
        );


        icon.classList.remove(
            "fa-solid"
        );


        icon.classList.add(
            "fa-regular"
        );


        button.title =
            "ذخیره";

    }

}


/* =========================================================
   INITIAL SAVE STATE
========================================================= */

function initSaveStates() {

    document
        .querySelectorAll(
            ".save-action"
        )
        .forEach(button => {

            const contentId =
                getContentId(
                    button
                );


            if (!contentId) {
                return;
            }


            updateSaveButton(
                button,
                SaveStorage.has(
                    contentId
                )
            );

        });

}


/* =========================================================
   COPY LINK
========================================================= */

async function handleCopyLink(button) {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );


        const icon =
            button.querySelector(
                "i"
            );


        const text =
            button.querySelector(
                "span"
            );


        if (icon) {

            icon.className =
                "fa-solid fa-check";

        }


        if (text) {

            text.textContent =
                "کپی شد";

        }


        setTimeout(() => {

            if (icon) {

                icon.className =
                    "fa-regular fa-copy";

            }


            if (text) {

                text.textContent =
                    "کپی لینک";

            }

        }, 1500);

    }

    catch (error) {

        console.error(
            "خطا در کپی لینک:",
            error
        );

    }

}


/* =========================================================
   EVENT DELEGATION
   برای دکمه‌های داینامیک
========================================================= */

function initContentActions() {

    document.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    ".share-button, .download-button, .save-action, .copy-link-action"
                );


            if (!button) {
                return;
            }


            /* =========================
               SHARE
            ========================= */

            if (
                button.classList.contains(
                    "share-button"
                )
            ) {

                await handleShare(
                    button
                );

                return;
            }


            /* =========================
               DOWNLOAD
            ========================= */

            if (
                button.classList.contains(
                    "download-button"
                )
            ) {

                await handleDownload(
                    button
                );

                return;
            }


            /* =========================
               SAVE
            ========================= */

            if (
                button.classList.contains(
                    "save-action"
                )
            ) {

                const contentId =
                    getContentId(
                        button
                    );


                if (!contentId) {

                    console.warn(
                        "SAVE: content ID پیدا نشد.",
                        button
                    );

                    return;
                }


                const isSaved =
                    SaveStorage.has(
                        contentId
                    );


                if (isSaved) {

                    SaveStorage.remove(
                        contentId
                    );


                    updateSaveButton(
                        button,
                        false
                    );

                }

                else {

                    SaveStorage.add(
                        contentId
                    );


                    updateSaveButton(
                        button,
                        true
                    );

                }


                return;
            }


            /* =========================
               COPY LINK
            ========================= */

            if (
                button.classList.contains(
                    "copy-link-action"
                )
            ) {

                await handleCopyLink(
                    button
                );

                return;
            }

        }
    );


    /*
     * وضعیت ذخیره‌شده‌ی دکمه‌هایی که
     * همین الان در DOM هستند
     */
    initSaveStates();
    /*
    * ثبت محتوا در تاریخچه
    */
    addCurrentContentToHistory();

}


/* =========================================================
   INITIALIZE
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initContentActions
    );

}

else {

    initContentActions();

}