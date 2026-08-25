/* =========================================================
   NAVBAR MENU
========================================================= */
/* =========================================================
   NAVBAR MENU
========================================================= */

const menuWrapper =
    document.querySelector(".menu-wrapper");

const menuToggle =
    document.querySelector(".menu-toggle");

const menuIcon =
    menuToggle.querySelector("i");


/* باز و بسته کردن منو */

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


/* کلیک بیرون از منو = بستن */

document.addEventListener("click", (event) => {

    if (
        !menuWrapper.contains(event.target)
    ) {

        closeMenu();

    }

});


/* بستن منو */

function closeMenu() {

    menuWrapper.classList.remove(
        "menu-open"
    );

    /* برگرداندن آیکون به سه خط */

    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");

    menuToggle.setAttribute(
        "aria-label",
        "باز کردن منو"
    );

}

/* =========================================================
   CATEGORY BAR SCROLL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".categories-container");
    const prevButton = document.querySelector(".category-prev");
    const nextButton = document.querySelector(".category-next");

    // اگر عناصر وجود نداشتند، اجرای کد متوقف شود
    if (!container || !prevButton || !nextButton) {
        return;
    }


    /* =========================
       میزان حرکت در هر کلیک
    ========================= */

    const scrollAmount = 100;


    /* =========================
       فلش راست
    ========================= */

    prevButton.addEventListener("click", () => {
        container.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
        

    });


    /* =========================
       فلش چپ
    ========================= */

    nextButton.addEventListener("click", () => {
        container.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });


    });

});