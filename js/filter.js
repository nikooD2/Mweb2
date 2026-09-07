/* =========================================================
   FILTER
========================================================= */

document.addEventListener("componentsLoaded", () => {

    const topicFilter =
        document.querySelector("#topic-filter");

    const speakerFilter =
        document.querySelector("#speaker-filter");

    const formatFilter =
        document.querySelector("#format-filter");

    const applyButton =
        document.querySelector("#apply-filter");


    if (
        !topicFilter ||
        !speakerFilter ||
        !formatFilter ||
        !applyButton
    ) {
        console.error("FILTER ELEMENTS NOT FOUND");
        return;
    }


    /* =========================================
       بررسی وضعیت فیلترها
    ========================================= */

    function updateFilterButton() {

        const hasFilter =
            topicFilter.value ||
            speakerFilter.value ||
            formatFilter.value;

        applyButton.disabled =
            !hasFilter;
    }


    /* =========================================
       تغییر فیلتر
    ========================================= */

    topicFilter.addEventListener(
        "change",
        updateFilterButton
    );

    speakerFilter.addEventListener(
        "change",
        updateFilterButton
    );

    formatFilter.addEventListener(
        "change",
        updateFilterButton
    );


    /* =========================================
       اعمال فیلتر
    ========================================= */

    applyButton.addEventListener(
        "click",
        () => {

            const topic =
                topicFilter.value;

            const speaker =
                speakerFilter.value;

            const format =
                formatFilter.value;


            if (
                !topic &&
                !speaker &&
                !format
            ) {
                return;
            }


            const params =
                new URLSearchParams();


            params.set(
                "type",
                "filtered"
            );


            if (topic) {

                params.set(
                    "topic",
                    topic
                );

            }


            if (speaker) {

                params.set(
                    "speaker",
                    speaker
                );

            }


            if (format) {

                params.set(
                    "format",
                    format
                );

            }


            window.location.href =
                `results.html?${params.toString()}`;

        }
    );


    /* =========================================
       وضعیت اولیه
    ========================================= */

    updateFilterButton();

});