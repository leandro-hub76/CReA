
document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.querySelector("#inicio");
    const quienes = document.querySelector("#quienes-somos");
    const mapa = document.querySelector("#mapa-interactivo");
    const botonQuienes = document.querySelector(".boton-quienes");
    const botonRegreso = quienes?.querySelector(".boton-menu");
    const secciones = document.querySelectorAll(".vista");

    if (!inicio || !quienes || !mapa) return;

    // QUIÉNES SOMOS permanece oculta al cargar la página.
    quienes.classList.remove("quienes-activa");
    quienes.setAttribute("aria-hidden", "true");

    // Prepara las animaciones de entrada y salida.
    document.body.classList.add("animaciones-activas");

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                entrada.target.classList.toggle(
                    "seccion-visible",
                    entrada.isIntersecting
                );
            });
        },
        {
            threshold: 0.15
        }
    );

    secciones.forEach((seccion) => {
        if (seccion !== quienes) {
            observador.observe(seccion);
        }
    });

    // Abre QUIÉNES SOMOS únicamente al pulsar su botón.
    botonQuienes?.addEventListener("click", (evento) => {
        evento.preventDefault();

        quienes.classList.add("quienes-activa");
        quienes.setAttribute("aria-hidden", "false");

        // Espera a que la vista se incorpore al diseño.
        requestAnimationFrame(() => {
            quienes.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            observador.observe(quienes);
        });
    });

    // El botón de menú de QUIÉNES SOMOS permite regresar al mapa.
    botonRegreso?.addEventListener("click", () => {
        quienes.classList.remove("quienes-activa");
        quienes.setAttribute("aria-hidden", "true");

        observador.unobserve(quienes);
        quienes.classList.remove("seccion-visible");

        // La vista se oculta y después se enfoca el mapa interactivo.
        mapa.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Detecta la dirección del scroll y actualiza su intensidad.
    let ultimaPosicion = window.scrollY;
    let cuadroPendiente = false;

    function actualizarScroll() {
        const posicion = window.scrollY;
        const diferencia = posicion - ultimaPosicion;

        document.body.classList.toggle(
            "scroll-bajando",
            diferencia > 0
        );

        document.body.classList.toggle(
            "scroll-subiendo",
            diferencia < 0
        );

        // Progreso de cada sección respecto al centro de la pantalla.
        document.querySelectorAll(".vista.seccion-visible").forEach((seccion) => {
            const rect = seccion.getBoundingClientRect();
            const centroPantalla = window.innerHeight / 2;
            const centroSeccion = rect.top + rect.height / 2;

            const distancia = (centroSeccion - centroPantalla) /
                Math.max(window.innerHeight, 1);

            const progreso = Math.max(
                -1,
                Math.min(1, distancia)
            );

            seccion.style.setProperty(
                "--progreso-scroll",
                progreso.toFixed(3)
            );
        });

        ultimaPosicion = posicion;
        cuadroPendiente = false;
    }

    window.addEventListener("scroll", () => {
        if (!cuadroPendiente) {
            requestAnimationFrame(actualizarScroll);
            cuadroPendiente = true;
        }
    }, { passive: true });

    actualizarScroll();
});
