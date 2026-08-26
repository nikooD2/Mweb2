 /* =========================================================
   CONTENT PAGE
========================================================= */


/*
    ========================================================
    DATA SOURCE
    ========================================================

    فعلاً اطلاعات از XML محلی خوانده می‌شود.

    بعداً برای اتصال به سرور فقط همین تابع را تغییر بده:

        getContentById()

    بقیه کد صفحه نیازی به تغییر ندارد.
*/


async function getContentById(id) {

    const response =
        await fetch("data/contents.xml");

    if (!response.ok) {
        throw new Error("XML could not be loaded.");
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


    const content =
        Array.from(
            xml.querySelectorAll("content")
        ).find(
            item =>
                item.getAttribute("id") === id
        );


    if (!content) {
        return null;
    }


    return parseContent(content);
}



/*
    ========================================================
    PARSE XML
    ========================================================
*/

function parseContent(element) {

    const getValue = selector => {

        const node =
            element.querySelector(selector);

        if (!node) {
            return null;
        }

        const value =
            node.textContent.trim();

        return value || null;
    };


    const sources =
        Array.from(
            element.querySelectorAll(
                "sources > source"
            )
        ).map(source => ({

            title:
                source.querySelector("title")
                    ?.textContent
                    .trim() || "",

            details:
                source.querySelector("details")
                    ?.textContent
                    .trim() || ""

        }));


    return {

        id:
            element.getAttribute("id"),

        title:
            getValue("title"),

        speaker:
            getValue("speaker"),

        text:
            getValue("text"),

        audio:
            getValue("audio"),

        video:
            getValue("video"),

        transcript:
            getValue("transcript"),

        sources

    };

}



/*
    ========================================================
    DOM ELEMENTS
    ========================================================
*/

const elements = {

    error:
        document.getElementById(
            "content-error"
        ),

    container:
        document.getElementById(
            "content-container"
        ),

    title:
        document.getElementById(
            "content-title"
        ),

    // type:
    //     document.getElementById(
    //         "content-type"
    //     ),

    speakerSection:
        document.getElementById(
            "content-speaker"
        ),

    speaker:
        document.getElementById(
            "speaker-name"
        ),

    textSection:
        document.getElementById(
            "text-section"
        ),

    text:
        document.getElementById(
            "content-text"
        ),

    audioSection:
        document.getElementById(
            "audio-section"
        ),

    audio:
        document.getElementById(
            "content-audio"
        ),

    videoSection:
        document.getElementById(
            "video-section"
        ),

    video:
        document.getElementById(
            "content-video"
        ),

    transcriptSection:
        document.getElementById(
            "transcript-section"
        ),

    transcript:
        document.getElementById(
            "content-transcript"
        ),

    sourcesSection:
        document.getElementById(
            "sources-section"
        ),

    sources:
        document.getElementById(
            "content-sources"
        ),

    download:
        document.getElementById(
            "download-button"
        ),

    share:
        document.getElementById(
            "share-button"
        ),

    copyLink:
        document.getElementById(
            "copy-link-button"
        )

};



/*
    ========================================================
    CONTENT TYPE
    ========================================================
*/

// function getContentType(content) {

//     if (content.video) {
//         return "ویدیو";
//     }

//     if (content.audio) {
//         return "صوت";
//     }

//     if (content.text) {
//         return "مقاله";
//     }

//     return "محتوا";

// }



/*
    ========================================================
    RENDER CONTENT
    ========================================================
*/

function renderContent(content) {


    /*
        TITLE
    */

    elements.title.textContent =
        content.title;


    /*
        TYPE
    */

    // elements.type.textContent =
    //     getContentType(content);



    /*
        SPEAKER
    */

    if (content.speaker) {

        elements.speaker.textContent =
            content.speaker;

        elements.speakerSection.hidden =
            false;

    }



    /*
        TEXT
    */

    if (content.text) {

        elements.text.textContent =
            content.text;

        elements.textSection.hidden =
            false;

    }



    /*
        AUDIO
    */

    if (content.audio) {

        elements.audio.src =
            content.audio;

        elements.audioSection.hidden =
            false;

    }



    /*
        VIDEO
    */

    if (content.video) {

        elements.video.src =
            content.video;

        elements.videoSection.hidden =
            false;

    }



    /*
        TRANSCRIPT
    */

    if (content.transcript) {

        elements.transcript.textContent =
            content.transcript;

        elements.transcriptSection.hidden =
            false;

    }



    /*
        SOURCES
    */

    if (
        content.sources &&
        content.sources.length > 0
    ) {

        renderSources(
            content.sources
        );

        elements.sourcesSection.hidden =
            false;

    }



    /*
        PAGE TITLE
    */

    document.title =
        `${content.title} | سامانه مصباح`;


    elements.container.hidden =
        false;

}



/*
    ========================================================
    RENDER SOURCES
    ========================================================
*/

function renderSources(sources) {

    elements.sources.innerHTML = "";


    sources.forEach(
        (source, index) => {

            const item =
                document.createElement("div");

            item.className =
                "source-item";


            item.innerHTML = `

                <span class="source-number">
                    ${index + 1}
                </span>

                <div class="source-content">

                    ${
                        source.title
                            ? `
                                <div class="source-title">
                                    ${escapeHTML(source.title)}
                                </div>
                              `
                            : ""
                    }

                    ${
                        source.details
                            ? `
                                <div class="source-details">
                                    ${escapeHTML(source.details)}
                                </div>
                              `
                            : ""
                    }

                </div>

            `;


            elements.sources.appendChild(
                item
            );

        }
    );

}



/*
    ========================================================
    ESCAPE HTML
    ========================================================

    برای زمانی که متن از سرور می‌آید
    بسیار مهم است.
*/

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}



/*
    ========================================================
    DOWNLOAD
    ========================================================
*/

function downloadContent(content) {

    const file =
        content.video ||
        content.audio;


    if (!file) {

        alert(
            "فایل قابل دانلودی برای این محتوا وجود ندارد."
        );

        return;

    }


    const link =
        document.createElement("a");

    link.href =
        file;

    link.download =
        "";


    document.body.appendChild(link);

    link.click();

    link.remove();

}



/*
    ========================================================
    SHARE
    ========================================================
*/

async function shareContent(content) {

    const shareData = {

        title:
            content.title,

        text:
            content.speaker
                ? `${content.title} - ${content.speaker}`
                : content.title,

        url:
            window.location.href

    };


    /*
        Web Share API
        مخصوص موبایل و مرورگرهای جدید
    */

    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
    ) {

        try {

            await navigator.share(
                shareData
            );

            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {
                return;
            }

        }

    }


    /*
        اگر Share API نبود
        لینک کپی می‌شود.
    */

    await copyCurrentLink();

}



/*
    ========================================================
    COPY LINK
    ========================================================
*/

async function copyCurrentLink() {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );


        showTemporaryMessage(
            "لینک محتوا کپی شد"
        );


    } catch {

        alert(
            "کپی لینک امکان‌پذیر نیست."
        );

    }

}



/*
    ========================================================
    TEMPORARY MESSAGE
    ========================================================
*/

function showTemporaryMessage(message) {

    const old =
        document.querySelector(
            ".content-toast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "content-toast";

    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => toast.remove(),
        2500
    );

}



/*
    ========================================================
    EVENTS
    ========================================================
*/

elements.copyLink.addEventListener(
    "click",
    copyCurrentLink
);


elements.share.addEventListener(
    "click",
    async () => {

        if (window.currentContent) {

            await shareContent(
                window.currentContent
            );

        }

    }
);


elements.download.addEventListener(
    "click",
    () => {

        if (window.currentContent) {

            downloadContent(
                window.currentContent
            );

        }

    }
);



/*
    ========================================================
    INITIALIZE
    ========================================================
*/

async function initContentPage() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        if (!id) {
            throw new Error(
                "Content ID is missing."
            );
        }


        const content =
            await getContentById(id);


        if (!content) {
            throw new Error(
                "Content not found."
            );
        }


        window.currentContent =
            content;


        renderContent(
            content
        );


    } catch (error) {

        console.error(
            "Content page error:",
            error
        );

        elements.error.hidden =
            false;

    }

}



/*
    ========================================================
    START
    ========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    initContentPage
);