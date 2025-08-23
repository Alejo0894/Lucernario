function setupImageModal(modalId = "modal-muestra", imageId = "imagen-modal", closeClass = "cerrar-modal") {
  const modal = document.getElementById(modalId);
  const modalImg = document.getElementById(imageId);
  const cerrarModal = document.querySelector(`.${closeClass}`);

  if (!modal || !modalImg || !cerrarModal) return;

  const openModal = (img) => {
    modal.style.display = "block";
    modalImg.src = img.src;
  };

  const closeModal = () => {
    modal.style.display = "none";
    modalImg.src = "";
  };

  document.addEventListener('click', (e) => {
    if (e.target.matches('.galeria-muestra img, .contenido-muestra img, .autor-box img')) {
      openModal(e.target);
    }

    if (e.target === cerrarModal || e.target === modal) {
      closeModal();
    }
  });
}

// Variables globales
let currentPdf = null;
let currentPageNum = 1;
let pageRendering = false;

// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener('click', function(e) {
  const link = e.target.closest('.view-pdf-btn, .open-pdf-modal');

  if (link) {
    e.preventDefault();
    const pdfUrl = link.getAttribute('data-pdf') || link.getAttribute('href');
    if (pdfUrl) {
      renderPdf(pdfUrl);
      document.getElementById('pdf-modal').style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }
});

async function renderPdf(url) {
  try {
    const container = document.getElementById('pdf-canvas-container');
    if (container) {
      container.innerHTML = '<div class="pdf-loading">Cargando...</div>';
    }

    const pageNumElement = document.getElementById('page-num');
    if (pageNumElement) {
      pageNumElement.textContent = '';
    }

    const loadingTask = pdfjsLib.getDocument(url);
    currentPdf = await loadingTask.promise;

    currentPageNum = 1;
    renderPage(currentPageNum);
  } catch (err) {
    // Errores silenciosos
  }
}

function renderPage(pageNum) {
  if (pageRendering || !currentPdf) return;

  const container = document.getElementById('pdf-canvas-container');
  pageRendering = true;

  currentPdf.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.className = 'pdf-page-canvas';

    container.innerHTML = '';
    container.appendChild(canvas);

    page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise.then(() => {
      pageRendering = false;
      document.getElementById('page-num').textContent =
        `Página ${pageNum} de ${currentPdf.numPages}`;
    });
  });
}

function showPreviousPage() {
  if (currentPageNum <= 1 || pageRendering) return;
  currentPageNum--;
  renderPage(currentPageNum);
}

function showNextPage() {
  if (!currentPdf || pageRendering) return;
  if (currentPageNum >= currentPdf.numPages) return;
  currentPageNum++;
  renderPage(currentPageNum);
}

document.addEventListener('DOMContentLoaded', function () {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  if (prevBtn) {
    prevBtn.addEventListener('click', showPreviousPage);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', showNextPage);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const closeBtns = document.querySelectorAll('.close-pdf-modal, #close-pdf-btn');
  const modal = document.getElementById('pdf-modal');

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPdf = null;
    currentPageNum = 1;
  }

  closeBtns.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});

