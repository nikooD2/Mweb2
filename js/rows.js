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


        let items =
            [...xml.querySelectorAll("item")];


        /* -----------------------------------------
           FILTER
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
