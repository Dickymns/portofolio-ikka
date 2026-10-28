
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Riska berhasil dijalankan!");

    // 1. TAHUN OTOMATIS PADA FOOTER
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // 2. MENU NAVIGASI MOBILE
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 700) {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 3. ANIMASI KARTU SAAT SCROLL
    const elements = document.querySelectorAll(
        ".section-heading, .info-card, .skill-card, .project-card, .contact-card"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach(function (element) {
            element.classList.add("visible");
        });
    } else {
        // Mengaktifkan CSS animasi
        document.documentElement.classList.add("js-motion");

        // Menambahkan class animasi pada elemen
        elements.forEach(function (element, index) {
            element.classList.add("reveal");

            if (
                element.classList.contains("info-card") ||
                element.classList.contains("skill-card") ||
                element.classList.contains("project-card")
            ) {
                element.style.transitionDelay =
                    (index % 4) * 100 + "ms";
            }
        });

        // Animasi berjalan kembali setiap kali elemen masuk layar
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    } else {
                        // Sembunyikan kembali agar bisa dianimasikan saat scroll berikutnya
                        entry.target.classList.remove("visible");
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -20px 0px"
            }
        );

        elements.forEach(function (element) {
            observer.observe(element);
        });
    }

    // 4. ANIMASI POP-UP FOTO PROFIL
    const profileFrame = document.querySelector(".profile-frame");

    if (profileFrame) {
        profileFrame.addEventListener("mouseenter", function () {
            profileFrame.classList.add("pop-up");
        });

        profileFrame.addEventListener("mouseleave", function () {
            profileFrame.classList.remove("pop-up");
        });
    }

    // 5. CEK FOTO PROFIL
    const profilePhoto = document.querySelector(".profile-photo");

    if (profilePhoto) {
        profilePhoto.addEventListener("error", function () {
            console.warn(
                "Foto tidak ditemukan. Periksa folder images dan nama riska.jpg."
            );
        });
    }
});

/* =====================================
   MODAL DETAIL PROYEK
===================================== */

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("projectModal");

    if (!modal) return;

    const dialog = modal.querySelector(".project-modal-dialog");
    const closeButton = document.getElementById("closeProjectModal");
    const title = document.getElementById("modalProjectTitle");
    const category = document.getElementById("modalProjectCategory");
    const description = document.getElementById("modalProjectDescription");
    const tagsContainer = document.getElementById("modalProjectTags");
    const contactLink = document.getElementById("modalContactLink");

    let previousTrigger = null;

    function openProjectModal(trigger) {
        const card = trigger.closest(".project-card");

        if (!card) return;

        const projectTitle = card.querySelector(".project-content h3");
        const projectCategory = card.querySelector(".project-type");
        const projectDescription = card.querySelector(".project-content p");
        const projectTags = card.querySelectorAll(".project-tags span");

        if (!projectTitle || !projectDescription) return;

        title.textContent = projectTitle.textContent.trim();
        category.textContent = projectCategory
            ? projectCategory.textContent.trim()
            : "Proyek";

        description.textContent = projectDescription.textContent.trim();

        // Salin teknologi dari kartu yang diklik.
        tagsContainer.replaceChildren();

        projectTags.forEach(function (tag) {
            const newTag = document.createElement("span");
            newTag.textContent = tag.textContent.trim();
            tagsContainer.appendChild(newTag);
        });

        previousTrigger = trigger;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        closeButton.focus();
    }

    function closeProjectModal() {
        if (!modal.classList.contains("is-open")) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (previousTrigger) {
            previousTrigger.focus();
        }
    }

    // Buka detail sesuai kartu proyek yang dipilih.
    document.querySelectorAll(
        '.project-card .project-link[data-project]'
    ).forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            openProjectModal(link);
        });
    });

    // Tombol X.
    closeButton.addEventListener("click", closeProjectModal);

    // Klik area gelap di luar jendela modal.
    modal.querySelectorAll("[data-close-modal]").forEach(function (element) {
        element.addEventListener("click", closeProjectModal);
    });

    // Tutup modal dengan tombol Escape.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {
            closeProjectModal();
        }

        // Jaga fokus keyboard tetap berada dalam modal.
        if (
            event.key === "Tab" &&
            modal.classList.contains("is-open")
        ) {
            const focusableElements = modal.querySelectorAll(
                'button, a[href], [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Tombol kontak di modal menutup modal dan menuju bagian kontak.
    contactLink.addEventListener("click", function () {
        closeProjectModal();
    });
});
