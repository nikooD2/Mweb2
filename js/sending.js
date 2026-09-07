document.addEventListener("DOMContentLoaded", () => {

    const tabs =
        document.querySelectorAll(".submission-tab");

    const forms =
        document.querySelectorAll(".submission-form");


    /* =========================================================
       TABS
    ========================================================= */

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const targetId =
                tab.dataset.form;


            /* =========================
               Tabs
            ========================= */

            tabs.forEach(item => {

                item.classList.remove("active");

            });

            tab.classList.add("active");


            /* =========================
               Forms
            ========================= */

            forms.forEach(form => {

                form.classList.remove("active");

            });


            const targetForm =
                document.getElementById(targetId);


            if (targetForm) {

                targetForm.classList.add("active");

            }

        });

    });

    /* =========================================================
    FILE UPLOAD
    ========================================================= */

    const uploadBox =
        document.querySelector(".upload-box");

    const uploadInput =
        document.getElementById("uploadFile");


    if (uploadBox && uploadInput) {

        let selectedFiles = [];


        /* =========================
        CLICK / FILE SELECT
        ========================= */

        uploadInput.addEventListener("change", () => {

            addFiles(uploadInput.files);

            // برای اینکه بتوانیم دوباره همان فایل را انتخاب کنیم
            uploadInput.value = "";

        });


        /* =========================
        DRAG EVENTS
        ========================= */

        [
            "dragenter",
            "dragover",
            "dragleave",
            "drop"
        ].forEach(eventName => {

            uploadBox.addEventListener(
                eventName,
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                }
            );

        });


        /* =========================
        DRAG OVER
        ========================= */

        [
            "dragenter",
            "dragover"
        ].forEach(eventName => {

            uploadBox.addEventListener(
                eventName,
                () => {

                    uploadBox.classList.add("drag-over");

                }
            );

        });


        /* =========================
        DRAG LEAVE
        ========================= */

        [
            "dragleave",
            "drop"
        ].forEach(eventName => {

            uploadBox.addEventListener(
                eventName,
                () => {

                    uploadBox.classList.remove("drag-over");

                }
            );

        });


        /* =========================
        DROP
        ========================= */

        uploadBox.addEventListener(
            "drop",
            event => {

                addFiles(
                    event.dataTransfer.files
                );

            }
        );


        /* =========================
        ADD FILES
        ========================= */

        function addFiles(files) {

            if (!files || files.length === 0) {
                return;
            }


            [...files].forEach(file => {

                selectedFiles.push(file);

            });


            renderFiles();

        }


        /* =========================
        RENDER FILES
        ========================= */

        function renderFiles() {

        uploadBox.classList.add("has-files");


        /* حذف محتوای اولیه آپلود */

        uploadBox.querySelector(
            ":scope > i"
        )?.remove();

        uploadBox.querySelector(
            ":scope > h3"
        )?.remove();

        uploadBox.querySelector(
            ":scope > p"
        )?.remove();

        uploadBox.querySelector(
            ":scope > span:not(.upload-file-hint)"
        )?.remove();

            /*
                input را پاک نمی‌کنیم
                چون باید همچنان داخل label باقی بماند.
            */

            const oldList =
                uploadBox.querySelector(
                    ".upload-file-list"
                );

            oldList?.remove();


            const oldTitle =
                uploadBox.querySelector(
                    ".upload-files-title"
                );

            oldTitle?.remove();


            const oldHint =
                uploadBox.querySelector(
                    ".upload-file-hint"
                );

            oldHint?.remove();


            /* عنوان */

            const title =
                document.createElement("h3");

            title.className =
                "upload-files-title";

            title.textContent =
                `${selectedFiles.length} فایل انتخاب شد`;


            /* لیست */

            const fileList =
                document.createElement("div");

            fileList.className =
                "upload-file-list";


            selectedFiles.forEach((file, index) => {

                const fileItem =
                    document.createElement("div");

                fileItem.className =
                    "upload-file-item";


                /* آیکون */

                const icon =
                    document.createElement("i");

                icon.className =
                    getFileIcon(file);


                /* اطلاعات */

                const info =
                    document.createElement("div");

                info.className =
                    "upload-file-info";


                const name =
                    document.createElement("strong");

                name.textContent =
                    file.name;


                const size =
                    document.createElement("small");

                size.textContent =
                    formatFileSize(file.size);


                info.appendChild(name);
                info.appendChild(size);


                /* حذف */

                const remove =
                    document.createElement("button");

                remove.type = "button";

                remove.className =
                    "remove-upload-file";

                remove.innerHTML =
                    '<i class="fa-solid fa-xmark"></i>';


                remove.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        selectedFiles.splice(index, 1);


                        if (
                            selectedFiles.length === 0
                        ) {

                            resetUploadBox();

                        } else {

                            renderFiles();

                        }

                    }
                );


                fileItem.appendChild(icon);

                fileItem.appendChild(info);

                fileItem.appendChild(remove);

                fileList.appendChild(fileItem);

            });


            uploadBox.appendChild(title);

            uploadBox.appendChild(fileList);


            /* Hint */

            const hint =
                document.createElement("span");

            hint.className =
                "upload-file-hint";

            hint.textContent =
                "برای افزودن فایل بیشتر کلیک کنید یا فایل را اینجا رها کنید";

            uploadBox.appendChild(hint);

        }


        /* =========================
        RESET
        ========================= */

        function resetUploadBox() {

            selectedFiles = [];

            uploadBox.classList.remove(
                "has-files"
            );

            renderOriginalUploadBox();

        }


        /* =========================
        ORIGINAL CONTENT
        ========================= */

        function renderOriginalUploadBox() {

            const title =
                uploadBox.querySelector(
                    ".upload-files-title"
                );

            title?.remove();


            const list =
                uploadBox.querySelector(
                    ".upload-file-list"
                );

            list?.remove();


            const hint =
                uploadBox.querySelector(
                    ".upload-file-hint"
                );

            hint?.remove();

        }


        /* =========================
        FILE ICON
        ========================= */

        function getFileIcon(file) {

            if (file.type.startsWith("image/")) {
                return "fa-solid fa-image";
            }

            if (file.type.startsWith("video/")) {
                return "fa-solid fa-video";
            }

            if (file.type.startsWith("audio/")) {
                return "fa-solid fa-music";
            }

            if (
                file.type === "application/pdf"
            ) {
                return "fa-solid fa-file-pdf";
            }

            if (
                file.name.endsWith(".doc") ||
                file.name.endsWith(".docx")
            ) {
                return "fa-solid fa-file-word";
            }

            return "fa-solid fa-file";

        }


        /* =========================
        FILE SIZE
        ========================= */

        function formatFileSize(bytes) {

            if (bytes < 1024) {

                return bytes + " B";

            }

            if (bytes < 1024 * 1024) {

                return (
                    (bytes / 1024).toFixed(1) +
                    " KB"
                );

            }

            return (
                (bytes / (1024 * 1024)).toFixed(1) +
                " MB"
            );

        }

    }
    /* =========================================================
       SUCCESS MODAL
    ========================================================= */

    const successModal =
        document.getElementById("successModal");

    const successTitle =
        document.getElementById("successTitle");

    const successMessage =
        document.getElementById("successMessage");

    const closeSuccess =
        document.getElementById("closeSuccess");


    forms.forEach(form => {

        form.addEventListener("submit", event => {

            event.preventDefault();


            /* دکمه‌ای که کاربر روی آن کلیک کرده */

            const clickedButton =
                event.submitter;


            if (
                clickedButton &&
                clickedButton.textContent.includes("پیشنهاد")
            ) {

                successTitle.textContent =
                    "پیشنهاد شما با موفقیت ارسال شد";

                successMessage.textContent =
                    "با تشکر از شما، پیشنهاد ارسالی ثبت شد. "

            } else {

                successTitle.textContent =
                    "محتوای شما با موفقیت ارسال شد";

                successMessage.textContent =
                    "با تشکر از شما، محتوای ارسالی ثبت شد. "

            }


            /* نمایش مودال */

            successModal.classList.add("show");

        });

    });


    /* =========================================================
       CLOSE SUCCESS MODAL
    ========================================================= */

    if (closeSuccess) {

        closeSuccess.addEventListener("click", () => {

            successModal.classList.remove("show");

        });

    }
});