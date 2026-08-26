/* =========================================================
   TOPICS PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards =
        document.querySelectorAll(".topic-card");


    cards.forEach(card => {

        card.addEventListener("click", () => {

            console.log(
                "Topic:",
                card.querySelector(".topic-name")?.textContent.trim()
            );

        });

    });

});