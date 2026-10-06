/* O valor de NAV_BREAKPOINT deve ser o mesmo do @media do hambúrguer em style.css. */
(function () {
    const NAV_BREAKPOINT = 1240;

    const header = document.querySelector(".header");
    if (!header) return;

    const toggle = header.querySelector(".nav-toggle");
    const menu = header.querySelector(".header-menu");
    if (!toggle || !menu) return;

    const compact = window.matchMedia("(max-width: " + NAV_BREAKPOINT + "px)");
    const canHover = window.matchMedia("(hover: hover)");
    const dropdowns = Array.from(menu.querySelectorAll(".dropdown"));

    function setDropdown(dropdown, open) {
        dropdown.classList.toggle("open", open);
        const trigger = dropdown.querySelector(".dropdown-toggle");
        if (trigger) trigger.setAttribute("aria-expanded", String(open));
    }

    function setMenu(open) {
        header.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        if (!open) dropdowns.forEach((d) => setDropdown(d, false));
    }

    toggle.addEventListener("click", () => {
        setMenu(!header.classList.contains("menu-open"));
    });

    // "ABRASCI+ Educação"
    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".dropdown-toggle");
        if (!trigger) return;
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("aria-haspopup", "true");
        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", (event) => {
            // No desktop o dropdown continua abrindo por hover
            if (!compact.matches && canHover.matches) return;
            event.preventDefault();
            setDropdown(dropdown, !dropdown.classList.contains("open"));
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setDropdown(dropdown, !dropdown.classList.contains("open"));
            }
        });
    });

    // Clicar em qualquer link do menu fecha o painel
    menu.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link && !link.classList.contains("dropdown-toggle")) setMenu(false);
    });

    // Clique fora fecha o painel
    document.addEventListener("click", (event) => {
        if (!header.classList.contains("menu-open")) return;
        if (!header.contains(event.target)) setMenu(false);
    });

    // Esc fecha o painel
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (header.classList.contains("menu-open")) {
            setMenu(false);
            toggle.focus();
        }
        dropdowns.forEach((d) => setDropdown(d, false));
    });

    // Voltou para a largura de desktop
    const onChange = (event) => {
        if (!event.matches) setMenu(false);
    };
    if (compact.addEventListener) compact.addEventListener("change", onChange);
    else compact.addListener(onChange);
})();
