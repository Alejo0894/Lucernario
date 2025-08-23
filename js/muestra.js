document.addEventListener('DOMContentLoaded', () => {
  const toggleMuestraButtons = document.querySelectorAll(".toggle-muestra");

  toggleMuestraButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const content = this.nextElementSibling;
      const isOpening = !content.classList.contains("open");

      // Cierra todas las demás muestras
      document.querySelectorAll(".contenido-muestra").forEach(m => {
        if (m !== content) {
          m.classList.remove("open");
          m.previousElementSibling.classList.remove("active");
        }
      });

      // Alterna la muestra actual
      content.classList.toggle("open", isOpening);
      this.classList.toggle("active", isOpening);
    });
  });
});
