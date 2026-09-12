/* =========================================================
   CONTENT ROWS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sliders =
        document.querySelectorAll(
            ".content-slider[data-xml]"
        );


    sliders.forEach(slider => {

        loadContentRow(slider);

    });

});


/* =========================================================
   LOAD CONTENT ROW
========================================================= */

async function loadContentRow(slider) {

    const xmlFile =
        slider.dataset.xml;


    const type =
        slider.dataset.type;


    const limit =
        parseInt(slider.dataset.limit) || null;


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


        if (
            xml.querySelector("parsererror")
        ) {

            throw new Error(
                "ساختار XML صحیح نیست."
            );

        }

        let items;

        if (type === "playlist") {

            items =
                [...xml.querySelectorAll("playlist")];

        } else {

            items =
                [...xml.querySelectorAll("content")];

        }
        /* -----------------------------------------
        FILTER BY IDS
        ----------------------------------------- */

        const ids =
            slider.dataset.ids;

        if (ids) {

            const allowedIds = [];

            ids.split(",").forEach(range => {

                const parts =
                    range.trim().split("-");

                const start =
                    parseInt(parts[0]);

                const end =
                    parts.length > 1
                        ? parseInt(parts[1])
                        : start;

                for (
                    let i = start;
                    i <= end;
                    i++
                ) {

                    allowedIds.push(String(i));

                }

            });


            items =
                items.filter(item => {

                    // ID از attribute گرفته می‌شود
                    const id =
                        item.getAttribute("id");

                    return allowedIds.includes(id);

                });

        }

        /* -----------------------------------------
        FILTER BY TYPE
        ----------------------------------------- */

        if (type) {

            items =
                items.filter(item => {

                    const itemType =
                        getXMLValue(
                            item,
                            "type"
                        );

                    return itemType === type;

                });

        }


        /* -----------------------------------------
           LIMIT
        ----------------------------------------- */

        if (limit) {

            items =
                items.slice(0, limit);

        }


        /* -----------------------------------------
           CLEAR
        ----------------------------------------- */

        slider.innerHTML = "";


        /* -----------------------------------------
           CREATE CARDS
        ----------------------------------------- */

        items.forEach(item => {

            const card =
                createCard(item);


            if (card) {

                slider.appendChild(card);

            }

        });


    } catch (error) {

        console.error(
            "خطا در بارگذاری نوار محتوا:",
            error
        );

    }

}
