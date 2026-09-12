/* =========================================================
   FILTER
========================================================= */

document.addEventListener("componentsLoaded", () => {

    const topicFilter =
        document.querySelector("#topic-filter");

    const speakerFilter =
        document.querySelector("#speaker-filter");

    const formatFilter =
        document.querySelector("#format-filter");

    const applyButton =
        document.querySelector("#apply-filter");

    const activeFilters =
        document.querySelector("#active-filters");


    if (
        !topicFilter ||
        !speakerFilter ||
        !formatFilter ||
        !applyButton ||
        !activeFilters
    ) {
        console.error("FILTER ELEMENTS NOT FOUND");
        return;
    }


    /* =========================================
       اطلاعات فیلترها
    ========================================= */

    const filterData = {

        topic: {
            element: topicFilter,
            title: "موضوع"
        },

        speaker: {
            element: speakerFilter,
            title: "سخنران"
        },

        format: {
            element: formatFilter,
            title: "قالب"
        }

    };


    /* =========================================
       فیلترهای فعال
    ========================================= */

    const active = {
        topic: "",
        speaker: "",
        format: ""
    };


    /* =========================================
       خواندن فیلترهای قبلی از URL
    ========================================= */

    const params =
        new URLSearchParams(window.location.search);


    active.topic =
        params.get("topic") || "";

    active.speaker =
        params.get("speaker") || "";

    active.format =
        params.get("format") || "";

    /* =========================================
    نام فارسی موضوعات
    ========================================= */

    const topicNames = {
        quran:
            "قرآن",
        ahlulbayt:
            "چهارده معصوم",
        prophets:
            "پیامبران",
        hadith:
            "حدیث",
        history:
            "تاریخ",
        seerah:
            "سیره",
        arabic:
            "قواعد عربی",
        aqeedah:
            "کلام و عقاید",
        fiqh:
            "فقه و احکام",
        ethics:
            "اخلاق",
        family:
            "خانواده",
        "islamic-sciences":
            "علوم اسلامی"
    };
    /* =========================================
       نمایش تگ‌های فعال
    ========================================= */

    function renderActiveFilters() {

        activeFilters.innerHTML = "";


        Object.keys(filterData).forEach(key => {

            const value =
                active[key];

            const select =
                filterData[key].element;


            /* =========================================
            اگر فیلتر فعال است
            ========================================= */

            if (value) {

                /* فیلد انتخاب را مخفی کن */
                select.closest(".filter-field").style.display =
                    "none";

let label = value;


/* موضوع مستقیماً از URL فارسی خوانده می‌شود */
if (key === "topic") {

    label = value;

}


/* سخنران و قالب از option خوانده می‌شوند */
else {

    const option =
        select.querySelector(
            `option[value="${value}"]`
        );


    if (!option) {
        return;
    }


    label =
        option.textContent.trim();

}


const tag =
    document.createElement("div");

                tag.className =
                    "active-filter-tag";


                tag.innerHTML = `

<span class="active-filter-label">
    ${label}
</span>

                    <button
                        type="button"
                        class="remove-filter"
                        data-filter="${key}"
                        aria-label="حذف فیلتر"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                `;


                activeFilters.appendChild(tag);

            }

            /* =========================================
            اگر فیلتر فعال نیست
            ========================================= */

            else {

                /* فیلد را دوباره نمایش بده */
                select.closest(".filter-field").style.display =
                    "";

            }

        });

    }


    /* =========================================
       بررسی تغییرات انتخاب‌شده
    ========================================= */

    function updateFilterButton() {

        const hasNewFilter =
            topicFilter.value ||
            speakerFilter.value ||
            formatFilter.value;

        applyButton.disabled =
            !hasNewFilter;

    }

    /* =========================================
    تغییر فیلتر
    ========================================= */

topicFilter.addEventListener("change", () => {

    active.topic =
        topicNames[topicFilter.value] || "";

    updateFilterButton();

});

    speakerFilter.addEventListener("change", () => {

        active.speaker = speakerFilter.value;

        updateFilterButton();

    });

    formatFilter.addEventListener("change", () => {

        active.format = formatFilter.value;

        updateFilterButton();

    });


    /* =========================================
    اعمال فیلتر
    ========================================= */

    applyButton.addEventListener("click", () => {

        /*
        * مقدار فعلی هر select مستقیماً
        * وضعیت همان فیلتر را مشخص می‌کند.
        *
        * اگر "همه..." انتخاب شده باشد،
        * مقدار خالی است و فیلتر حذف می‌شود.
        */

// active.topic =
//     topicFilter.value;

        active.speaker =
            speakerFilter.value;

        active.format =
            formatFilter.value;


        const newParams =
            new URLSearchParams();


        const currentType =
            params.get("type");

        if (currentType) {
            newParams.set("type", currentType);
        }


/* موضوع → فارسی در URL */

if (active.topic) {

    newParams.set(
        "topic",
        active.topic
    );

}


/* سخنران → بدون تغییر */

if (active.speaker) {

    newParams.set(
        "speaker",
        active.speaker
    );

}


/* قالب → بدون تغییر */

if (active.format) {

    newParams.set(
        "format",
        active.format
    );

}


        window.location.href =
            `results.html?${newParams.toString()}`;

    });

    /* =========================================
       حذف یک فیلتر
    ========================================= */

    activeFilters.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".remove-filter"
                );


            if (!button) {
                return;
            }


            const filter =
                button.dataset.filter;


            active[filter] = "";


            const newParams =
                new URLSearchParams();


            const currentType =
                params.get("type");

            if (currentType) {
                newParams.set("type", currentType);
            }


/* =========================================
   موضوع → فارسی
========================================= */

if (active.topic) {

    newParams.set(
        "topic",
        active.topic
    );

}


/* =========================================
   سخنران
========================================= */

if (active.speaker) {

    newParams.set(
        "speaker",
        active.speaker
    );

}


/* =========================================
   قالب
========================================= */

if (active.format) {

    newParams.set(
        "format",
        active.format
    );

}


            window.location.href =
                `results.html?${newParams.toString()}`;

        }
    );


    /* =========================================
       مقداردهی Select ها
    ========================================= */

topicFilter.value =
    Object.keys(topicNames)
        .find(
            key =>
                topicNames[key] === active.topic
        ) || "";

    speakerFilter.value =
        active.speaker;

    formatFilter.value =
        active.format;


    /* =========================================
       وضعیت اولیه
    ========================================= */

    renderActiveFilters();

    updateFilterButton();

});