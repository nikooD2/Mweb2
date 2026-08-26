/* =========================================================
   LOAD COMPONENTS
========================================================= */

async function loadComponent(elementId, filePath) {

    const element =
        document.getElementById(elementId);

    if (!element) return;

    try {

        const response =
            await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `Failed to load: ${filePath}`
            );
        }

        const html =
            await response.text();

        element.innerHTML = html;

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   INITIALIZE SITE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       LOAD HEADER
    ========================= */

    await loadComponent(
        "header",
        "components/header.html"
    );


    /* =========================
       LOAD FOOTER
    ========================= */

    await loadComponent(
        "footer",
        "components/footer.html"
    );


    /* =========================
       INITIALIZE HEADER JS
    ========================= */

    initNavbarMenu();
    initCategoryBar();
    initNavbarDropdowns();
    initLanguageSelector();

});



/* =========================================================
   NAVBAR MENU
========================================================= */

function initNavbarMenu() {

    const menuWrapper =
        document.querySelector(".menu-wrapper");

    const menuToggle =
        document.querySelector(".menu-toggle");


    /* اگر هدر وجود نداشت */

    if (!menuWrapper || !menuToggle) {
        return;
    }


    const menuIcon =
        menuToggle.querySelector("i");


    if (!menuIcon) {
        return;
    }


    /* =========================
       OPEN / CLOSE
    ========================= */

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();


        const isOpen =
            menuWrapper.classList.toggle("menu-open");


        /* تغییر آیکون */

        if (isOpen) {

            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");

            menuToggle.setAttribute(
                "aria-label",
                "بستن منو"
            );

        } else {

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

            menuToggle.setAttribute(
                "aria-label",
                "باز کردن منو"
            );

        }

    });


    /* =========================
       CLICK OUTSIDE
    ========================= */

    document.addEventListener("click", (event) => {

        if (!menuWrapper.contains(event.target)) {

            closeMenu();

        }

    });


    /* =========================
       CLOSE MENU
    ========================= */

    function closeMenu() {

        menuWrapper.classList.remove(
            "menu-open"
        );


        menuIcon.classList.remove(
            "fa-xmark"
        );

        menuIcon.classList.add(
            "fa-bars"
        );


        menuToggle.setAttribute(
            "aria-label",
            "باز کردن منو"
        );

    }

}



/* =========================================================
   CATEGORY BAR SCROLL
========================================================= */

function initCategoryBar() {

    const container =
        document.querySelector(
            ".categories-container"
        );

    const prevButton =
        document.querySelector(
            ".category-prev"
        );

    const nextButton =
        document.querySelector(
            ".category-next"
        );


    if (
        !container ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }


    const scrollAmount = 100;


    /* =========================
       RIGHT
    ========================= */

    prevButton.addEventListener(
        "click",
        () => {

            container.scrollBy({

                left: scrollAmount,

                behavior: "smooth"

            });

        }
    );


    /* =========================
       LEFT
    ========================= */

    nextButton.addEventListener(
        "click",
        () => {

            container.scrollBy({

                left: -scrollAmount,

                behavior: "smooth"

            });

        }
    );

}



/* =====================================
   NAVBAR DROPDOWNS
===================================== */

function initNavbarDropdowns() {

    const buttons =
        document.querySelectorAll(
            "[data-dropdown]"
        );

    const dropdowns =
        document.querySelectorAll(
            ".nav-dropdown"
        );


    if (
        !buttons.length ||
        !dropdowns.length
    ) {
        return;
    }


    /* =========================
       BUTTON CLICK
    ========================= */

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const dropdownId =
                    button.dataset.dropdown;


                const dropdown =
                    document.getElementById(
                        dropdownId
                    );


                if (!dropdown) {
                    return;
                }


                /* بستن بقیه */

                dropdowns.forEach(item => {

                    if (item !== dropdown) {

                        item.classList.remove(
                            "show"
                        );

                    }

                });


                /* =========================
                   TOGGLE
                ========================= */

                if (
                    dropdown.classList.contains(
                        "show"
                    )
                ) {

                    dropdown.classList.remove(
                        "show"
                    );

                    return;

                }


                /* =========================
                   POSITION
                ========================= */

                const rect =
                    button.getBoundingClientRect();


                dropdown.classList.add("show");


                const dropdownWidth =
                    dropdown.offsetWidth;

                const dropdownHeight =
                    dropdown.offsetHeight;


                let left =
                    rect.left +
                    (rect.width / 2) -
                    (dropdownWidth / 2);


                let top =
                    rect.bottom + 12;


                const margin = 10;


                /* =========================
                   RIGHT / LEFT BOUNDARIES
                ========================= */

                if (
                    left + dropdownWidth >
                    window.innerWidth - margin
                ) {

                    left =
                        window.innerWidth -
                        dropdownWidth -
                        margin;

                }


                if (left < margin) {

                    left = margin;

                }


                /* =========================
                   BOTTOM
                ========================= */

                if (
                    top + dropdownHeight >
                    window.innerHeight - margin
                ) {

                    top =
                        rect.top -
                        dropdownHeight -
                        12;

                }


                dropdown.style.left =
                    `${left}px`;

                dropdown.style.top =
                    `${top}px`;

            }
        );

    });


    /* =========================
       CLICK OUTSIDE
    ========================= */

    document.addEventListener(
        "click",
        () => {

            dropdowns.forEach(dropdown => {

                dropdown.classList.remove(
                    "show"
                );

            });

        }
    );


    /* =========================
       CLOSE ON SCROLL
    ========================= */

    window.addEventListener(
        "scroll",
        () => {

            dropdowns.forEach(dropdown => {

                dropdown.classList.remove(
                    "show"
                );

            });

        }
    );

}



/* =========================================================
   LANGUAGE SELECTOR
========================================================= */

function initLanguageSelector() {

    const languageLink =
        document.querySelector(
            "#language-link"
        );

    const selectedLanguage =
        document.querySelector(
            "#selected-language"
        );

    const languageOptions =
        document.querySelectorAll(
            ".language-option"
        );


    if (
        !languageLink ||
        !selectedLanguage
    ) {
        return;
    }


    /* =========================
       OPEN / CLOSE
    ========================= */

    languageLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            languageLink.classList.toggle(
                "language-open"
            );

        }
    );


    /* =========================
       SELECT LANGUAGE
    ========================= */

    languageOptions.forEach(option => {

        option.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const language =
                    option.dataset.lang;


                selectedLanguage.textContent =
                    `زبان: ${language}`;


                /* حذف active */

                languageOptions.forEach(item => {

                    item.classList.remove(
                        "active"
                    );


                    const check =
                        item.querySelector(
                            ".fa-check"
                        );


                    if (check) {

                        check.remove();

                    }

                });


                /* active */

                option.classList.add(
                    "active"
                );


                /* ساخت تیک */

                const check =
                    document.createElement("i");


                check.className =
                    "fa-solid fa-check";


                option.appendChild(check);


                /* بستن */

                languageLink.classList.remove(
                    "language-open"
                );

            }
        );

    });


    /* =========================
       CLICK OUTSIDE
    ========================= */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !languageLink.contains(
                    event.target
                )
            ) {

                languageLink.classList.remove(
                    "language-open"
                );

            }

        }
    );

}