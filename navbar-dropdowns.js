/* =====================================
   NAVBAR DROPDOWNS
   Shared between Desktop & Mobile
===================================== */

function initNavbarDropdowns() {

    const buttons =
        document.querySelectorAll("[data-dropdown]");

    const dropdowns =
        document.querySelectorAll(".nav-dropdown");


    if (!buttons.length || !dropdowns.length) {
        return;
    }


    /* =================================
       BUTTON CLICK
    ================================= */

    buttons.forEach(button => {

        button.addEventListener("click", function (event) {

            event.stopPropagation();


            const dropdownId =
                button.dataset.dropdown;

            const dropdown =
                document.getElementById(dropdownId);


            if (!dropdown) {
                return;
            }


            /* بستن dropdownهای دیگر */

            dropdowns.forEach(item => {

                if (item !== dropdown) {

                    item.classList.remove("show");

                }

            });


            /* اگر همین dropdown باز است */

            if (dropdown.classList.contains("show")) {

                dropdown.classList.remove("show");

                return;

            }


            /* =================================
               POSITION
            ================================= */

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


            /* =================================
               SCREEN BOUNDARIES
            ================================= */

            const margin = 10;


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


            /* اگر پایین صفحه جا نبود */

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

        });

    });


    /* =================================
       CLICK OUTSIDE
    ================================= */

    document.addEventListener("click", function () {

        dropdowns.forEach(dropdown => {

            dropdown.classList.remove("show");

        });

    });


    /* =================================
       CLOSE ON SCROLL
    ================================= */

    window.addEventListener("scroll", function () {

        dropdowns.forEach(dropdown => {

            dropdown.classList.remove("show");

        });

    });

}


/* =====================================
   INITIALIZE
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initNavbarDropdowns();

    }
);