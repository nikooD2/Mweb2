/* =========================================================
   CONTENT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadContent();

    initShare();

    initDownload();

});

/* =========================================================
   LOAD CONTENT
========================================================= */

async function loadContent() {

    try {

        const params = new URLSearchParams(
            window.location.search
        );

        const contentId = params.get("id");

        if (!contentId) {
            throw new Error("شناسه محتوا پیدا نشد.");
        }


        const response = await fetch(
            "data/contents.xml"
        );

        if (!response.ok) {
            throw new Error(
                "XML پیدا نشد. Status: " +
                response.status
            );
        }


        const xmlText = await response.text();

        const xml = new DOMParser().parseFromString(
            xmlText,
            "application/xml"
        );


        if (xml.querySelector("parsererror")) {
            throw new Error(
                "ساختار XML مشکل دارد."
            );
        }


        const content = Array.from(
            xml.querySelectorAll("content")
        ).find(
            item => item.getAttribute("id") === contentId
        );


        if (!content) {
            throw new Error(
                "محتوای موردنظر پیدا نشد."
            );
        }


        renderContent(content);

    }

    catch (error) {

        console.error(
            "CONTENT ERROR:",
            error
        );

        document.body.innerHTML += `
            <div style="
                direction:rtl;
                padding:40px;
                font-family:sans-serif;
                color:red;
            ">
                خطا در بارگذاری محتوا:
                <br><br>
                ${error.message}
            </div>
        `;
    }
}


/* =========================================================
   RENDER CONTENT
========================================================= */

function renderContent(content) {

    renderContentInfo(content);

    const type = getText(content, "type");

    if (type === "video") {
        renderVideo(content);
        return;
    }

    if (type === "audio") {
        renderAudio(content);
        return;
    }

    if (type === "article") {
        console.log(
            "Article layout is not implemented yet."
        );
    }
}


/* =========================================================
   VIDEO
========================================================= */

function renderVideo(content) {

    const layout = document.getElementById(
        "video-layout"
    );

    layout.style.display = "block";


    /* VIDEO */

    const video = getText(
        content,
        "video"
    );

    const videoElement = document.getElementById(
        "content-video"
    );

    const videoSource = document.getElementById(
        "video-source"
    );

    if (video) {

        videoSource.src = video;
        videoElement.load();

    }


    /* TITLE */

    document.getElementById(
        "video-title"
    ).textContent = getText(
        content,
        "title"
    );


    /* TAGS */

    renderTags(
        content,
        "video-topic"
    );


    /* SPEAKER */

    renderSpeaker(content);


    /* TRANSCRIPT */

    renderTranscript(
        content,
        "video-transcript-section",
        "video-transcript",
        "video-transcript-more"
    );


    /* AUDIO */

    renderVideoAudio(content);
}


/* =========================================================
   VIDEO AUDIO
========================================================= */

function renderVideoAudio(content) {

    const section = document.getElementById(
        "video-audio-section"
    );

    const audio = getText(
        content,
        "audio"
    );

    if (!audio) {
        section.style.display = "none";
        return;
    }


    section.style.display = "block";


    /* COVER */

    const cover = getText(
        content,
        "cover"
    );

    const coverElement = document.getElementById(
        "video-audio-cover"
    );

    if (cover) {
        coverElement.src = cover;
    }


    /* AUDIO */

    const source = document.getElementById(
        "video-audio-source"
    );

    const audioElement = document.getElementById(
        "video-audio"
    );

    document.getElementById(
        "audio-title"
    ).textContent = "صوت " +getText(
        content,
        "title"
    );

    source.src = audio;
    audioElement.load();


    /* PLAYER */

    initAudioPlayer(
        "video-audio",
        "video-audio-play",
        "video-audio-progress",
        "video-audio-current",
        "video-audio-duration"
    );
}


/* =========================================================
   AUDIO ONLY
========================================================= */

function renderAudio(content) {

    const layout = document.getElementById(
        "audio-layout"
    );

    layout.style.display = "block";


    /* COVER */

    const cover = getText(
        content,
        "cover"
    );

    if (cover) {

        document.getElementById(
            "audio-cover"
        ).src = cover;

    }


    /* TITLE */

    document.getElementById(
        "audio-title"
    ).textContent = getText(
        content,
        "title"
    );


    /* SPEAKER + TAGS */

    renderAudioTags(content);


    /* AUDIO */

    const audio = getText(
        content,
        "audio"
    );

    const source = document.getElementById(
        "audio-source"
    );

    const audioElement = document.getElementById(
        "content-audio"
    );


    source.src = audio;
    audioElement.load();


    initAudioPlayer(
        "content-audio",
        "audio-play",
        "audio-progress-bar",
        "audio-current",
        "audio-duration"
    );


    /* TRANSCRIPT */

    renderTranscript(
        content,
        "audio-transcript-section",
        "audio-transcript",
        "audio-transcript-more"
    );
}


/* =========================================================
   AUDIO PLAYER
========================================================= */

function initAudioPlayer(
    audioId,
    playId,
    progressId,
    currentId,
    durationId
) {

    const audio = document.getElementById(audioId);
    const playButton = document.getElementById(playId);
    const progress = document.getElementById(progressId);
    const currentTime = document.getElementById(currentId);
    const duration = document.getElementById(durationId);


    if (
        !audio ||
        !playButton ||
        !progress ||
        !currentTime ||
        !duration
    ) {
        return;
    }


    /* جلوگیری از چند بار Event */

    if (audio.dataset.initialized === "true") {
        return;
    }

    audio.dataset.initialized = "true";


    /* PLAY / PAUSE */

    playButton.onclick = () => {

        if (audio.paused) {

            audio.play();

            playButton.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        } else {

            audio.pause();

            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';
        }
    };


    /* DURATION */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            duration.textContent =
                formatTime(audio.duration);

        }
    );


    /* PROGRESS */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) {
                return;
            }

            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );
        }
    );


    /* SEEK */

    progress.oninput = () => {

        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (
                progress.value / 100
            ) * audio.duration;
    };


    /* END */

    audio.addEventListener(
        "ended",
        () => {

            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

            progress.value = 0;

            currentTime.textContent =
                "00:00";
        }
    );
}


/* =========================================================
   TAGS
========================================================= */

function renderTags(
    content,
    containerId
) {

    const container = document.getElementById(
        containerId
    );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    content.querySelectorAll(
        "tags > tag"
    ).forEach(tagElement => {

        const tagName =
            tagElement.textContent.trim();

        if (!tagName) {
            return;
        }


        const tag =
            document.createElement("a");

        tag.className = "content-tag";

        tag.href =
            "results.html?type=" +
            encodeURIComponent(tagName);

        tag.textContent = tagName;

        container.appendChild(tag);
    });
}


/* =========================================================
   AUDIO TAGS
========================================================= */

function renderAudioTags(content) {

    const container = document.getElementById(
        "audio-tags"
    );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    /* SPEAKER */

    const speaker = getText(
        content,
        "speaker"
    );

    if (speaker) {

        const speakerTag =
            document.createElement("a");

        speakerTag.className =
            "content-tag";

        speakerTag.href =
            "speakers.html?speaker=" +
            encodeURIComponent(speaker);

        speakerTag.textContent = speaker;

        container.appendChild(
            speakerTag
        );
    }


    /* TAGS */

    renderTags(
        content,
        "audio-tags"
    );
}


/* =========================================================
   SPEAKER
========================================================= */

function renderSpeaker(content) {

    const speaker = getText(
        content,
        "speaker"
    );

    const speakerLink =
        document.getElementById(
            "video-speaker"
        );


    if (!speaker) {

        speakerLink.style.display = "none";

        return;
    }


    speakerLink.style.display = "";


    document.getElementById(
        "video-speaker-name"
    ).textContent = speaker;


    document.getElementById(
        "speaker-initial"
    ).textContent =
        speaker.charAt(0);


    speakerLink.href =
        "speakers.html?speaker=" +
        encodeURIComponent(speaker);
}


/* =========================================================
   TRANSCRIPT
========================================================= */

function renderTranscript(
    content,
    sectionId,
    textId,
    buttonId
) {

    const section = document.getElementById(
        sectionId
    );

    if (!section) {
        return;
    }


    const transcript = getText(
        content,
        "transcript"
    );


    if (!transcript) {

        section.style.display = "none";

        return;
    }


    section.style.display = "";


    const text = document.getElementById(
        textId
    );

    const button = document.getElementById(
        buttonId
    );


    text.textContent = transcript;

    text.classList.add("collapsed");
    text.classList.remove("expanded");


    button.innerHTML =
        `بیشتر
         <i class="fa-solid fa-chevron-down"></i>`;


    button.onclick = () => {

        const expanded =
            text.classList.toggle(
                "expanded"
            );

        text.classList.toggle(
            "collapsed",
            !expanded
        );


        button.innerHTML = expanded

            ? `بستن
               <i class="fa-solid fa-chevron-up"></i>`

            : `بیشتر
               <i class="fa-solid fa-chevron-down"></i>`;
    };
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {
        return "00:00";
    }


    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}


/* =========================================================
   XML HELPER
========================================================= */

function getText(
    parent,
    selector
) {

    const element =
        parent.querySelector(selector);

    return element
        ? element.textContent.trim()
        : "";
}

/* =========================================================
   CONTENT INFO
========================================================= */

function renderContentInfo(content) {

    document
        .querySelectorAll("[data-content-info]")
        .forEach(element => {

            const infoType =
                element.dataset.contentInfo;

            const value =
                getText(content, infoType);

            if (!value) {
                return;
            }

            element.appendChild(
                document.createTextNode(
                    " " + value
                )
            );
        });
}

/* =========================================================
   WEB SHARE
========================================================= */

function initShare() {

    const shareButtons =
        document.querySelectorAll(".share-button");


    if (!shareButtons.length) {
        return;
    }


    shareButtons.forEach(button => {

        button.addEventListener("click", async () => {

            try {

                /* =========================
                   CONTENT ID
                ========================= */

                const params =
                    new URLSearchParams(
                        window.location.search
                    );

                const contentId =
                    params.get("id");


                if (!contentId) {
                    return;
                }


                /* =========================
                   LOAD XML
                ========================= */

                const response =
                    await fetch("data/contents.xml");

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


                /* =========================
                   FIND CONTENT
                ========================= */

                const content =
                    Array.from(
                        xml.querySelectorAll("content")
                    ).find(
                        item =>
                            item.getAttribute("id") ===
                            contentId
                    );


                if (!content) {
                    throw new Error(
                        "محتوا پیدا نشد."
                    );
                }


                /* =========================
                   CONTENT INFO
                ========================= */

                const title =
                    getText(content, "title");

                const speaker =
                    getText(content, "speaker");

                const type =
                    getText(content, "type");


                /* =========================
                   DETERMINE MEDIA TYPE
                   BASED ON BUTTON
                ========================= */

                const audioActions =
                    button.closest(".audio-actions");


                let mediaUrl = "";
                let mediaType = "";


                /* AUDIO BUTTON */

                if (audioActions) {

                    mediaUrl =
                        getText(
                            content,
                            "audio"
                        );

                    mediaType = "audio";
                }


                /* VIDEO BUTTON */

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
                   DOWNLOAD MEDIA
                ========================= */

                const mediaResponse =
                    await fetch(mediaUrl);


                if (
                    !mediaResponse.ok
                ) {
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
                            ? "mosbah-video.mp4"
                            : "mosbah-audio.mp3";
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
                   WEB SHARE
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

        });

    });

}

/* =========================================================
   DOWNLOAD
========================================================= */

function initDownload() {

    const downloadButtons =
        document.querySelectorAll(".download-button");

    if (!downloadButtons.length) {
        return;
    }

    downloadButtons.forEach(button => {

        button.addEventListener("click", async () => {

            try {

                const params =
                    new URLSearchParams(
                        window.location.search
                    );

                const contentId =
                    params.get("id");

                if (!contentId) {
                    return;
                }

                const response =
                    await fetch("data/contents.xml");

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
                            contentId
                    );

                if (!content) {
                    throw new Error(
                        "محتوا پیدا نشد."
                    );
                }

                const type =
                    getText(content, "type");

                /*
                 * اگر دکمه داخل بخش صوتی باشد
                 * همیشه فایل audio دانلود می‌شود.
                 */
                const audioActions =
                    button.closest(".audio-actions");

                let mediaUrl = "";

                if (audioActions) {

                    mediaUrl =
                        getText(
                            content,
                            "audio"
                        );

                }

                /*
                 * دکمه اصلی محتوا
                 */
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

                const mediaResponse =
                    await fetch(mediaUrl);

                if (!mediaResponse.ok) {

                    throw new Error(
                        "فایل رسانه‌ای پیدا نشد."
                    );

                }

                const blob =
                    await mediaResponse.blob();

                let fileName =
                    mediaUrl
                        .split("/")
                        .pop()
                        .split("?")[0];

                if (!fileName) {

                    fileName =
                        type === "video"
                            ? "mosbah-video.mp4"
                            : "mosbah-audio.mp3";

                }

                const blobUrl =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = blobUrl;
                link.download = fileName;

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                URL.revokeObjectURL(blobUrl);

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

        });

    });

}

/* =========================================================
   SAVE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".save-action").forEach(button => {

        button.addEventListener("click", () => {

            const icon = button.querySelector("i");
            const text = button.querySelector("span");

            button.classList.toggle("saved");

            if (button.classList.contains("saved")) {

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

                text.textContent = "ذخیره شد";

            } else {

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

                text.textContent = "ذخیره";

            }

        });

    });

});

/* =========================================================
   COPY LINK
========================================================= */

document.querySelectorAll(".copy-link-action").forEach(button => {

    button.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(window.location.href);

            const icon = button.querySelector("i");
            const text = button.querySelector("span");

            icon.className = "fa-solid fa-check";
            text.textContent = "کپی شد";

            setTimeout(() => {

                icon.className = "fa-regular fa-copy";
                text.textContent = "کپی لینک";

            }, 1500);

        } catch (error) {

            console.error("خطا در کپی لینک:", error);

        }

    });

});