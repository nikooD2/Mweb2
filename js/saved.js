/* =========================================================
   SAVED PAGE
========================================================= */

const SAVED_CONTENTS_KEY =
    "mesbah_saved_contents";


/* =========================================================
   LOAD SAVED CONTENTS
========================================================= */

async function loadSavedContents() {

    const grid =
        document.getElementById(
            "saved-grid"
        );

    const empty =
        document.getElementById(
            "saved-empty"
        );

    const loading =
        document.getElementById(
            "saved-loading"
        );

    const error =
        document.getElementById(
            "saved-error"
        );

    const count =
        document.getElementById(
            "saved-count"
        );


    if (!grid) return;


    /* =====================================================
       GET SAVED IDS
    ===================================================== */

    let savedIds = [];

    try {

        savedIds =
            JSON.parse(
                localStorage.getItem(
                    SAVED_CONTENTS_KEY
                )
            ) || [];

    } catch {

        savedIds = [];

    }


    /* =====================================================
       UPDATE COUNT
    ===================================================== */

    if (count) {

        count.textContent =
            `${savedIds.length} محتوا`;

    }


    /* =====================================================
       EMPTY
    ===================================================== */

    if (!savedIds.length) {

        if (loading) {
            loading.hidden = true;
        }

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    /* =====================================================
       LOAD XML
    ===================================================== */

    try {

        const response =
            await fetch(
                "data/contents2.xml"
            );


        if (!response.ok) {

            throw new Error(
                "XML پیدا نشد."
            );

        }


        const xmlText =
            await response.text();


        const xml =
            new DOMParser()
                .parseFromString(
                    xmlText,
                    "application/xml"
                );


        /* =================================================
           FIND SAVED CONTENTS
        ================================================= */

        const contents =
            Array.from(
                xml.querySelectorAll(
                    "content"
                )
            );


        const savedContents =
            savedIds
                .map(id => {

                    return contents.find(
                        content =>
                            content.getAttribute(
                                "id"
                            ) === String(id)
                    );

                })
                .filter(Boolean);


        /* =================================================
           REMOVE INVALID IDS
        ================================================= */

        if (
            savedContents.length !==
            savedIds.length
        ) {

            const validIds =
                savedContents.map(
                    content =>
                        content.getAttribute(
                            "id"
                        )
                );


            localStorage.setItem(
                SAVED_CONTENTS_KEY,
                JSON.stringify(validIds)
            );

        }


        /* =================================================
           UPDATE COUNT
        ================================================= */

        if (count) {

            count.textContent =
                `${savedContents.length} محتوا`;

        }


        /* =================================================
           NO VALID CONTENT
        ================================================= */

        if (!savedContents.length) {

            if (loading) {
                loading.hidden = true;
            }

            if (empty) {
                empty.hidden = false;
            }

            return;

        }


        /* =================================================
           CREATE CARDS
        ================================================= */

        savedContents.forEach(
            content => {

                const card =
                    createCard(
                        content
                    );


                if (card) {

                    grid.appendChild(
                        card
                    );

                }

            }
        );


        /* =================================================
           SHOW GRID
        ================================================= */

        if (loading) {
            loading.hidden = true;
        }

        if (grid) {
            grid.hidden = false;
        }

    }


    catch (err) {

        console.error(
            "SAVED PAGE ERROR:",
            err
        );


        if (loading) {
            loading.hidden = true;
        }

        if (error) {
            error.hidden = false;
        }

    }

}


/* =========================================================
   INIT
========================================================= */

function initSavedPage() {

    loadSavedContents();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initSavedPage
    );

}

else {

    initSavedPage();

}