document.addEventListener('DOMContentLoaded', () => {
  // Inicialización del modal de imágenes
  setupImageModal();

  // Función de carga dinámica
  const loadDynamicContent = (container) => {
    if (!container.dataset.loaded) {
      const url = container.getAttribute('data-html');
      const nocacheUrl = url + (url.includes('?') ? '&' : '?') + 'nocache=' + Date.now();

      fetch(nocacheUrl, {
        cache: 'no-store'
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then(html => {
          container.innerHTML = html;
          container.dataset.loaded = true;

          // Activar eventos para nuevas imágenes cargadas
          const images = container.querySelectorAll('.galeria-muestra img, img[data-modal]');
          images.forEach(img => {
            img.style.cursor = 'pointer';
          });
        })
        .catch(error => {
          console.error('Error cargando el contenido:', error);
          container.innerHTML = `
            <p class="error-message">
              Error al cargar el contenido. 
              <button onclick="location.reload()">Reintentar</button>
            </p>
          `;
        });
    }
  };

  // Carga inicial de contenido visible
  document.querySelectorAll('.scrollable[data-html], .contenido-muestra[data-html]').forEach(container => {
    if (container.closest('.contenido-articulo.open, .contenido-muestra.open')) {
      loadDynamicContent(container);
    }
  });

  // Carga bajo demanda
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-articulo')) {
      const content = e.target.nextElementSibling;
      const scrollable = content.querySelector('.scrollable[data-html]');
      if (scrollable) loadDynamicContent(scrollable);
    }

    if (e.target.classList.contains('toggle-muestra')) {
      const content = e.target.nextElementSibling;
      if (content && content.hasAttribute('data-html')) {
        loadDynamicContent(content);
      }
    }
  });
});
