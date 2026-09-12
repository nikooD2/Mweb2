document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll(
            ".cards-container[data-xml]"
        )
        .forEach(container => {

            loadCards(container);

        });

});


async function loadCards(container) {

    const xmlFile =
        container.dataset.xml;

    const type =
        container.dataset.type;

    const limit =
        parseInt(container.dataset.limit) || null;


    try {

        const response =
            await fetch(xmlFile);

        if (!response.ok) {

            throw new Error(
                `خطا در دریافت XML: ${response.status}`
            );

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


        /* =========================================================
           ITEMS
           اگر نوع playlist باشد، خود playlistها خوانده می‌شوند
           در غیر این صورت contentها خوانده می‌شوند
        ========================================================= */

        let items;


        if (type === "playlist") {

            items =
                [...xml.querySelectorAll("playlist")];

        }

        else {

            items =
                [...xml.querySelectorAll("content")];

        }


        /* =========================================================
           TYPE FILTER
        ========================================================= */

        if (type && type !== "playlist") {

            items =
                items.filter(item =>
                    getXMLValue(item, "type") === type
                );

        }


        /* =========================================================
           LIMIT
        ========================================================= */

        if (limit) {

            items =
                items.slice(0, limit);

        }


        /* =========================================================
           RENDER
        ========================================================= */

        container.innerHTML = "";


        items.forEach(item => {

            const card =
                createCard(item);


            if (card) {

                container.appendChild(card);

            }

        });


    } catch (error) {

        console.error(
            "خطا در بارگذاری کارت‌ها:",
            error
        );

    }

}