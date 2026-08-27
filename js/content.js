/* =========================================================
   CONTENT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadContent();

});


/* =========================================================
   LOAD CONTENT
========================================================= */

async function loadContent() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const contentId =
            params.get("id");


        console.log(
            "CONTENT ID:",
            contentId
        );


        if (!contentId) {

            document.body.innerHTML +=
                "<p>شناسه محتوا پیدا نشد.</p>";

            return;

        }


        const response =
            await fetch(
                "data/contents.xml"
            );


        console.log(
            "XML RESPONSE:",
            response
        );


        if (!response.ok) {

            throw new Error(
                "XML پیدا نشد. Status: " +
                response.status
            );

        }


        const xmlText =
            await response.text();


        console.log(
            "XML:",
            xmlText
        );


        const parser =
            new DOMParser();


        const xml =
            parser.parseFromString(
                xmlText,
                "application/xml"
            );


        const parseError =
            xml.querySelector(
                "parsererror"
            );


        if (parseError) {

            throw new Error(
                "ساختار XML مشکل دارد."
            );

        }


        const contents =
            xml.querySelectorAll(
                "content"
            );


        console.log(
            "NUMBER OF CONTENTS:",
            contents.length
        );


        const content =
            Array.from(
                contents
            ).find(
                item =>
                    item.getAttribute("id") ===
                    contentId
            );


        console.log(
            "FOUND CONTENT:",
            content
        );


        if (!content) {

            throw new Error(
                "محتوای با id=" +
                contentId +
                " پیدا نشد."
            );

        }


        renderContent(
            content
        );

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

function renderContent(
    content
) {

    const type =
        getText(
            content,
            "type"
        );


    /*
        VIDEO
    */

    if (type === "video") {

        renderVideo(
            content
        );

        return;

    }


    /*
        AUDIO
    */

    if (type === "audio") {

        renderAudio(
            content
        );

        return;

    }


    /*
        ARTICLE
    */

    if (type === "article") {

        console.log(
            "Article layout is not implemented yet."
        );

        return;

    }

}



/* =========================================================
   VIDEO
========================================================= */

function renderVideo(
    content
) {

    const layout =
        document.getElementById(
            "video-layout"
        );


    layout.style.display =
        "block";



    /*
        VIDEO
    */

    const video =
        getText(
            content,
            "video"
        );


    const videoElement =
        document.getElementById(
            "content-video"
        );


    const videoSource =
        document.getElementById(
            "video-source"
        );


    if (video) {

        videoSource.src =
            video;

        videoElement.load();

    }



    /*
        TITLE
    */

    document.getElementById(
        "video-title"
    ).textContent =
        getText(
            content,
            "title"
        );



    /*
        TAGS
    */

    renderTags(
        content,
        "video-topic"
    );



    /*
        SPEAKER
    */

    renderSpeaker(
        content
    );



    /*
        TRANSCRIPT
    */

    renderTranscript(
        content,
        "video-transcript-section",
        "video-transcript",
        "video-transcript-more"
    );


    /*
        RELATED AUDIO
    */

    renderVideoAudio(
        content
    );

}

/* =========================================================
   VIDEO AUDIO
========================================================= */

function renderVideoAudio(
    content
) {

    const section =
        document.getElementById(
            "video-audio-section"
        );


    if (!section) {

        return;

    }


    const audio =
        getText(
            content,
            "audio"
        );


    /*
        اگر صوت نداشت
    */

    if (!audio) {

        section.style.display =
            "none";

        return;

    }


    section.style.display =
        "block";


    /*
        AUDIO TITLE
    */

    const title =
        getText(
            content,
            "title"
        );


    const titleElement =
        document.getElementById(
            "video-audio-title"
        );


    if (titleElement) {

        titleElement.textContent =
            "صوت " + title;

    }


    /*
        AUDIO SOURCE
    */

    const audioSource =
        document.getElementById(
            "video-audio-source"
        );


    const audioElement =
        document.getElementById(
            "video-audio"
        );


    if (audioSource && audioElement) {

        audioSource.src =
            audio;

        audioElement.load();

    }


    /*
        INIT PLAYER
    */

    initVideoAudioPlayer();

}

/* =========================================================
   VIDEO AUDIO PLAYER
========================================================= */

function initVideoAudioPlayer() {

    const audio =
        document.getElementById(
            "video-audio"
        );


    const playButton =
        document.getElementById(
            "video-audio-play"
        );


    const progress =
        document.getElementById(
            "video-audio-progress"
        );


    const currentTime =
        document.getElementById(
            "video-audio-current"
        );


    const duration =
        document.getElementById(
            "video-audio-duration"
        );


    if (
        !audio ||
        !playButton ||
        !progress ||
        !currentTime ||
        !duration
    ) {

        return;

    }


    /*
        جلوگیری از اضافه شدن
        چندباره Event
    */

    if (
        audio.dataset.initialized ===
        "true"
    ) {

        return;

    }


    audio.dataset.initialized =
        "true";


    /*
        PLAY / PAUSE
    */

    playButton.onclick =
        () => {

            if (audio.paused) {

                audio.play();

                playButton.innerHTML =
                    '<i class="fa-solid fa-pause"></i>';

            }

            else {

                audio.pause();

                playButton.innerHTML =
                    '<i class="fa-solid fa-play"></i>';

            }

        };


    /*
        DURATION
    */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }
    );


    /*
        PROGRESS
    */

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


    /*
        SEEK
    */

    progress.oninput =
        () => {

            if (!audio.duration) {

                return;

            }


            audio.currentTime =
                (
                    progress.value /
                    100
                ) *
                audio.duration;

        };


    /*
        END
    */

    audio.addEventListener(
        "ended",
        () => {

            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

            progress.value =
                0;

            currentTime.textContent =
                "00:00";

        }
    );

}

/* =========================================================
   AUDIO
========================================================= */

function renderAudio(
    content
) {

    const layout =
        document.getElementById(
            "audio-layout"
        );


    layout.style.display =
        "block";



    /*
        COVER
    */

    const cover =
        getText(
            content,
            "cover"
        );


    const coverElement =
        document.getElementById(
            "audio-cover"
        );


    if (cover) {

        coverElement.src =
            cover;

    }



    /*
        TITLE
    */

    document.getElementById(
        "audio-title"
    ).textContent =
        getText(
            content,
            "title"
        );



    /*
        SPEAKER + TAGS
    */

    renderAudioTags(
        content
    );



    /*
        AUDIO
    */

    const audio =
        getText(
            content,
            "audio"
        );


    const audioSource =
        document.getElementById(
            "audio-source"
        );


    audioSource.src =
        audio;


    const audioElement =
        document.getElementById(
            "content-audio"
        );


    audioElement.load();



    /*
        TRANSCRIPT
    */

    renderTranscript(
        content,
        "audio-transcript-section",
        "audio-transcript",
        "audio-transcript-more"
    );



    /*
        AUDIO PLAYER
    */

    initAudioPlayer();

}



/* =========================================================
   TAGS
========================================================= */

function renderTags(
    content,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";



    /*
        TAG LIST
    */

    const tags =
        content.querySelectorAll(
            "tags > tag"
        );


    if (!tags.length) {

        return;

    }


    tags.forEach(
        tagElement => {

            const tagName =
                tagElement.textContent.trim();


            if (!tagName) {

                return;

            }


            const tag =
                document.createElement(
                    "a"
                );


            tag.className =
                "content-tag";


            tag.href =
                "results.html?type=" +
                encodeURIComponent(
                    tagName
                );


            tag.textContent =
                tagName;


            container.appendChild(
                tag
            );

        }
    );

}



/* =========================================================
   AUDIO TAGS
========================================================= */

function renderAudioTags(
    content
) {

    const container =
        document.getElementById(
            "audio-tags"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";



    /*
        SPEAKER
    */

    const speaker =
        getText(
            content,
            "speaker"
        );


    if (speaker) {

        const speakerTag =
            document.createElement(
                "a"
            );


        speakerTag.className =
            "content-tag";


        speakerTag.href =
            "speakers.html?speaker=" +
            encodeURIComponent(
                speaker
            );


        speakerTag.textContent =
            speaker;


        container.appendChild(
            speakerTag
        );

    }



    /*
        TAGS
    */

    const tags =
        content.querySelectorAll(
            "tags > tag"
        );


    tags.forEach(
        tagElement => {

            const tagName =
                tagElement.textContent.trim();


            if (!tagName) {

                return;

            }


            const tag =
                document.createElement(
                    "a"
                );


            tag.className =
                "content-tag";


            tag.href =
                "results.html?type=" +
                encodeURIComponent(
                    tagName
                );


            tag.textContent =
                tagName;


            container.appendChild(
                tag
            );

        }
    );

}



/* =========================================================
   SPEAKER
========================================================= */

function renderSpeaker(
    content
) {

    const speaker =
        getText(
            content,
            "speaker"
        );


    const speakerLink =
        document.getElementById(
            "video-speaker"
        );


    if (!speaker) {

        speakerLink.style.display =
            "none";

        return;

    }


    speakerLink.style.display =
        "";


    document.getElementById(
        "video-speaker-name"
    ).textContent =
        speaker;



    /*
        SPEAKER INITIAL
    */

    const initial =
        document.getElementById(
            "speaker-initial"
        );


    if (initial) {

        initial.textContent =
            speaker.charAt(0);

    }



    /*
        SPEAKER LINK
    */

    speakerLink.href =
        "speakers.html?speaker=" +
        encodeURIComponent(
            speaker
        );

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

    const transcript =
        getText(
            content,
            "transcript"
        );


    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {

        return;

    }


    if (!transcript) {

        section.style.display =
            "none";

        return;

    }


    section.style.display =
        "";


    const text =
        document.getElementById(
            textId
        );


    text.textContent =
        transcript;


    /*
        شروع در حالت بسته
    */

    text.classList.add(
        "collapsed"
    );


    text.classList.remove(
        "expanded"
    );



    /*
        MORE BUTTON
    */

    const button =
        document.getElementById(
            buttonId
        );


    if (!button) {

        return;

    }


    button.innerHTML =
        `بیشتر
         <i class="fa-solid fa-chevron-down"></i>`;


    button.onclick =
        () => {

            const isExpanded =
                text.classList.toggle(
                    "expanded"
                );


            text.classList.toggle(
                "collapsed",
                !isExpanded
            );


            button.innerHTML =
                isExpanded

                    ? `بستن
                       <i class="fa-solid fa-chevron-up"></i>`

                    : `بیشتر
                       <i class="fa-solid fa-chevron-down"></i>`;

        };

}



/* =========================================================
   RELATED AUDIO
========================================================= */

function renderRelatedAudio(
    content
) {

    const card =
        document.getElementById(
            "related-audio"
        );


    if (!card) {

        return;

    }


    card.style.display =
        "flex";



    /*
        COVER
    */

    const image =
        document.getElementById(
            "related-audio-image"
        );


    if (image) {

        image.src =
            getText(
                content,
                "cover"
            );

    }



    /*
        TITLE
    */

    const title =
        document.getElementById(
            "related-audio-title"
        );


    if (title) {

        title.textContent =
            getText(
                content,
                "title"
            );

    }



    /*
        LINK
    */

    card.href =
        "#";

}



/* =========================================================
   AUDIO PLAYER
========================================================= */

function initAudioPlayer() {

    const audio =
        document.getElementById(
            "content-audio"
        );


    const playButton =
        document.getElementById(
            "audio-play"
        );


    const progress =
        document.getElementById(
            "audio-progress-bar"
        );


    const currentTime =
        document.getElementById(
            "audio-current"
        );


    const duration =
        document.getElementById(
            "audio-duration"
        );


    if (
        !audio ||
        !playButton ||
        !progress ||
        !currentTime ||
        !duration
    ) {

        return;

    }



    /*
        PLAY / PAUSE
    */

    playButton.onclick =
        () => {

            if (audio.paused) {

                audio.play();

                playButton.innerHTML =
                    '<i class="fa-solid fa-pause"></i>';

            }

            else {

                audio.pause();

                playButton.innerHTML =
                    '<i class="fa-solid fa-play"></i>';

            }

        };



    /*
        DURATION
    */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }
    );



    /*
        PROGRESS
    */

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



    /*
        SEEK
    */

    progress.oninput =
        () => {

            if (!audio.duration) {

                return;

            }


            audio.currentTime =
                (
                    progress.value /
                    100
                ) *
                audio.duration;

        };



    /*
        END
    */

    audio.addEventListener(
        "ended",
        () => {

            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

            progress.value =
                0;

        }
    );

}



/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    seconds
) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "00:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(
            remainingSeconds
        ).padStart(
            2,
            "0"
        )
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
        parent.querySelector(
            selector
        );


    return element
        ? element.textContent.trim()
        : "";

}