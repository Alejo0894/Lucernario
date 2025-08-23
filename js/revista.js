document.addEventListener('DOMContentLoaded', () => {
  const toggleNumeroButtons = document.querySelectorAll(".toggle-numero");
  const toggleArticuloButtons = document.querySelectorAll(".toggle-articulo");

  // Función para cerrar los artículos
  const closeAllArticulos = () => {
    document.querySelectorAll(".contenido-articulo.open").forEach(articulo => {
      articulo.classList.remove("open");
      articulo.previousElementSibling.classList.remove("active");
    });
  };

  // Números de revista
  toggleNumeroButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const content = this.nextElementSibling;
      const isOpening = !content.classList.contains("open");

      // 1. Cierra todos los artículos primero
      closeAllArticulos();

      // 2. Cierra otros números excepto el actual
      document.querySelectorAll(".contenido-numero").forEach(n => {
        if (n !== content) {
          n.classList.remove("open");
          n.previousElementSibling.classList.remove("active");
        }
      });

      // 3. Alterna el número clickeado
      content.classList.toggle("open", isOpening);
      this.classList.toggle("active", isOpening);
    });
  });

  // Artículos
  toggleArticuloButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const content = this.nextElementSibling;
      const container = this.closest(".contenido-numero");

      // Cierra otros artículos del mismo número
      container.querySelectorAll(".contenido-articulo").forEach(a => {
        if (a !== content) {
          a.classList.remove("open");
          a.previousElementSibling.classList.remove("active");
        }
      });

      // Alterna el artículo clickeado
      content.classList.toggle("open");
      this.classList.toggle("active");
    });
  });
});
