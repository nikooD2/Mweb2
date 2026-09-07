document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       FRAMES
    ========================================================= */

    const frames =
        document.querySelectorAll(".about-frame");


    /* =========================================================
       STATS
    ========================================================= */

    const statNumber =
        document.getElementById("stat-number");

    const statLabel =
        document.getElementById("stat-label");

    const statItems =
        document.querySelectorAll(".stat-item");


    const stats = [

        {
            number: 1240,
            label: "ویدیو"
        },

        {
            number: 380,
            label: "صوت"
        },

        {
            number: 256,
            label: "مقاله"
        },

        {
            number: 84,
            label: "دوره"
        }

    ];


    /* =========================================================
       EASING
    ========================================================= */

    function easeInOut(progress) {

        return progress < 0.5

            ? 2 * progress * progress

            : 1 -
              Math.pow(
                  -2 * progress + 2,
                  2
              ) / 2;
    }


    /* =========================================================
       COUNTER
    ========================================================= */

    function animateNumber(
        element,
        target,
        progress
    ) {

        const value =
            Math.floor(
                target *
                Math.min(progress * 2, 1)
            );


        element.textContent =
            value.toLocaleString("fa-IR");
    }


    /* =========================================================
       MAIN SCROLL
    ========================================================= */

    let ticking = false;


    function updateScene() {

        const scrollTop =
            window.scrollY;


        const aboutScroll =
            document.querySelector(".about-scroll");

        const aboutHeight =
            aboutScroll.offsetHeight;

        const maxScroll =
            aboutHeight - window.innerHeight;

        let progress =
            maxScroll > 0
                ? scrollTop / maxScroll
                : 0;


        progress =
            Math.max(
                0,
                Math.min(1, progress)
            );


        /*
         * تعداد صحنه‌ها به صورت خودکار
         * از تعداد about-frame ها گرفته می‌شود.
         */

        const sceneCount =
            frames.length;


        const scenePosition =
            progress * sceneCount;


        let sceneIndex =
            Math.floor(scenePosition);


        sceneIndex =
            Math.min(
                sceneIndex,
                sceneCount - 1
            );


        /*
         * میزان پیشرفت داخل صحنه
         */

        const localProgress =
            scenePosition - sceneIndex;


        /* =====================================================
           FRAME SWITCH
        ====================================================== */

        frames.forEach(
            (frame, index) => {

                frame.classList.toggle(
                    "active",
                    index === sceneIndex
                );

            }
        );


        /* =====================================================
           INTRO
        ====================================================== */

        if (sceneIndex === 0) {

            const frame =
                frames[0];

            const photo =
                frame.querySelector(
                    ".intro-photo"
                );

            const copy =
                frame.querySelector(
                    ".intro-copy"
                );


            const p =
                easeInOut(
                    localProgress
                );


            const exit =
                Math.max(
                    0,
                    (p - 0.55) / 0.45
                );


            if (photo) {

                photo.style.transform =
                    `
                    translateX(${exit * -160}px)
                    scale(${1 - exit * 0.12})
                    `;

            }


            if (copy) {

                copy.style.transform =
                    `
                    translateX(${exit * 160}px)
                    `;

            }

        }


        /* =====================================================
           ABOUT
        ====================================================== */

        if (sceneIndex === 1) {

            const frame =
                frames[1];

            const image =
                frame.querySelector(
                    ".about-photo img"
                );

            const copy =
                frame.querySelector(
                    ".about-copy"
                );


            const p =
                easeInOut(
                    localProgress
                );


            if (image) {

                image.style.transform =
                    `
                    scale(${1 + p * 0.08})
                    translateY(${p * -25}px)
                    `;


                const exit =
                    Math.max(
                        0,
                        (p - 0.65) / 0.35
                    );


                image.parentElement.style.transform =
                    `
                    translateX(${exit * -150}px)
                    scale(${1 - exit * 0.1})
                    `;

            }


            if (copy) {

                const exit =
                    Math.max(
                        0,
                        (p - 0.65) / 0.35
                    );


                copy.style.transform =
                    `
                    translateX(${exit * 150}px)
                    `;

            }

        }


        /* =====================================================
           SEARCH
        ====================================================== */

        if (sceneIndex === 2) {

            const frame =
                frames[2];

            const image =
                frame.querySelector(
                    ".search-photo"
                );

            const copy =
                frame.querySelector(
                    ".search-copy"
                );


            const p =
                easeInOut(
                    localProgress
                );


            if (image) {

                const exit =
                    Math.max(
                        0,
                        (p - 0.65) / 0.35
                    );


                image.style.transform =
                    `
                    translateY(${p * -30}px)
                    translateX(${exit * 150}px)
                    scale(${1 + p * 0.06})
                    `;

            }


            if (copy) {

                const exit =
                    Math.max(
                        0,
                        (p - 0.65) / 0.35
                    );


                copy.style.transform =
                    `
                    translateX(${exit * -150}px)
                    `;

            }

        }


        /* =====================================================
           STATS
        ====================================================== */

        if (sceneIndex === 3) {

            const p =
                easeInOut(
                    localProgress
                );


            const index =
                Math.min(
                    3,
                    Math.floor(p * 4)
                );


            const data =
                stats[index];


            if (statNumber && statLabel) {

                animateNumber(
                    statNumber,
                    data.number,
                    (p * 4) - index
                );


                statLabel.textContent =
                    data.label;

            }


            statItems.forEach(
                (item, i) => {

                    item.classList.toggle(
                        "active",
                        i === index
                    );

                }
            );

        }


        ticking = false;
    }


    /* =========================================================
       SCROLL LISTENER
    ========================================================= */

    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateScene
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       INITIAL
    ========================================================= */

    updateScene();

});
