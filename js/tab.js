document.addEventListener('DOMContentLoaded', function() {
  // Inicializar la pestaña activa
  const tabs = document.querySelectorAll('.tab');
  const statsGrids = document.querySelectorAll('.stats-grid');

  // Función para mostrar la pestaña activa
  function showTab(period) {
      // Ocultar todas las secciones de estadísticas
      statsGrids.forEach(grid => {
          grid.style.display = 'none'; // Asegúrate de ocultar todas las secciones
      });

      // Mostrar solo la sección correspondiente a la pestaña activa
      const activeGrid = document.getElementById(period);
      if (activeGrid) {
          activeGrid.style.display = 'grid'; // Usa 'grid' para que se aplique el CSS de cuadrícula
      }

      // Cambiar el estado de las pestañas
      tabs.forEach(tab => {
          if (tab.getAttribute('data-period') === period) {
              tab.classList.add('active');
              tab.classList.remove('inactive');
          } else {
              tab.classList.remove('active');
              tab.classList.add('inactive');
          }
      });
  }

  // Mostrar la pestaña "total" al cargar la página
  showTab('total');

  // Añadir event listeners a las pestañas
  tabs.forEach(tab => {
      tab.addEventListener('click', function() {
          const period = this.getAttribute('data-period');
          showTab(period);
      });
  });
});