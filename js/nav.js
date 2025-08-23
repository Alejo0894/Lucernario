document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section");

  // Forzar Inicio al recargar
  const forceHomeOnReload = () => {
    const navigationType = performance.navigation.type;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile || navigationType === 1) {
      changeSection("inicio");
      window.history.replaceState(null, null, window.location.pathname);
    }
  };

  let isTransitioning = false; 

  const changeSection = (targetId) => {
    if (isTransitioning) return;
    isTransitioning = true;

    const current = document.querySelector("section.active");

    navLinks.forEach(link => {
      const isActive = link.getAttribute("data-target") === targetId;
      link.style.backgroundColor = isActive ? "#ccaa00" : "";
      link.style.fontWeight = isActive ? "bold" : "normal";
    });

    const next = document.getElementById(targetId);
    if (!next || next === current) {
      isTransitioning = false;
      return;
    }

    // Animación de salida de la sección actual
    if (current) {
      current.classList.remove("fade-in");
      current.classList.add("fade-out");
      current.addEventListener('transitionend', () => {
        current.classList.remove("active", "fade-out");
        // Animación de entrada de la siguiente sección
        next.classList.add("active");
        void next.offsetWidth; // fuerza reflow para animación
        next.classList.add("fade-in");
        isTransitioning = false;
      }, { once: true });
    } else {
      next.classList.add("active");
      void next.offsetWidth;
      next.classList.add("fade-in");
      isTransitioning = false;
    }
  };

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      changeSection(e.target.getAttribute("data-target"));
      window.history.replaceState(null, null, ' ');
    });
  });

  forceHomeOnReload();
});

// Navegación para pestañas de las muestras
document.querySelectorAll('.muestra-pestaña').forEach(pestaña => {
    pestaña.addEventListener('click', () => {
      // Activar pestaña
      document.querySelectorAll('.muestra-pestaña').forEach(p => p.classList.remove('active'));
      pestaña.classList.add('active');

      // Mostrar contenido asociado con transición
      document.querySelectorAll('.muestra-contenido').forEach(c => {
        c.classList.remove('active');
      });
      const activo = document.getElementById('pestaña-' + pestaña.dataset.pestaña);
      activo.classList.add('active');
    });
  });
  
const contenedorPestañas = document.querySelector('.muestra-pestañas');

contenedorPestañas.addEventListener('wheel', (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    contenedorPestañas.scrollLeft += e.deltaY;
  }
});