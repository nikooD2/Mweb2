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


        let items =
            [...xml.querySelectorAll("item")];


        if (type) {

            items =
                items.filter(item =>
                    getXMLValue(item, "type") === type
                );

        }


        if (limit) {

            items =
                items.slice(0, limit);

        }


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