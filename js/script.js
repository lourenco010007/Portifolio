const header = document.querySelector(".site-header");
const heroVisual = document.querySelector(".hero-visual");
const languageButtons = document.querySelectorAll("[data-language]");
const translatableElements = document.querySelectorAll("[data-pt][data-en]");
const pageTitle = document.querySelector("title");
const description = document.querySelector('meta[name="description"]');
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.classList.toggle("is-lit", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", themeToggle.dataset[`${document.documentElement.lang}Label`]);
    themeColor.content = isDark ? "#161E44" : "#f8f8f5";

    try {
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    } catch (error) {
        console.warn("Não foi possível guardar a preferência de tema.", error);
    }
}

function setLanguage(language) {
    const selectedLanguage = language === "en" ? "en" : "pt";
    document.documentElement.lang = selectedLanguage;

    translatableElements.forEach((element) => {
        const translation = element.dataset[selectedLanguage];
        if (translation !== undefined) {
            element.innerHTML = translation;
        }
    });
    document.querySelectorAll("[data-pt-aria-label][data-en-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", element.dataset[`${selectedLanguage}AriaLabel`]);
    });
    document.querySelectorAll("[data-pt-alt][data-en-alt]").forEach((element) => {
        element.setAttribute("alt", element.dataset[`${selectedLanguage}Alt`]);
    });

    languageButtons.forEach((button) => {
        const isActive = button.dataset.language === selectedLanguage;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    themeToggle.setAttribute("aria-label", themeToggle.dataset[`${selectedLanguage}Label`]);

    pageTitle.textContent = selectedLanguage === "en"
        ? "Portfolio — Lourenço Souto"
        : "Portfólio — Lourenço Souto";
    description.content = selectedLanguage === "en"
        ? "Portfolio of Lourenço Souto, web developer."
        : "Portfólio de Lourenço Souto, desenvolvedor web.";

    try {
        localStorage.setItem("portfolio-language", selectedLanguage);
    } catch (error) {
        console.warn("Não foi possível guardar a preferência de idioma.", error);
    }
}

languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
});

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});

let scrollFrame = 0;
function updateHeader() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
        scrollFrame = 0;
    });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window) {
    const portraitObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle(
            "is-portrait-visible",
            !entry.isIntersecting && entry.boundingClientRect.bottom < 0 && window.scrollY > 24
        );
    }, { threshold: 0.08 });

    portraitObserver.observe(heroVisual);
} else {
    const updatePortrait = () => {
        const portraitRect = heroVisual.getBoundingClientRect();
        header.classList.toggle("is-portrait-visible", portraitRect.bottom < 0 && window.scrollY > 24);
    };
    window.addEventListener("scroll", updatePortrait, { passive: true });
    updatePortrait();
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

try {
    const savedLanguage = localStorage.getItem("portfolio-language");
    if (savedLanguage) setLanguage(savedLanguage);
} catch (error) {
    console.warn("Não foi possível ler a preferência de idioma guardada.", error);
}

try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) setTheme(savedTheme);
} catch (error) {
    console.warn("Não foi possível ler a preferência de tema guardada.", error);
}
