document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos la sección de estadísticas y la mostramos como activa por defecto
    const statsSection = document.getElementById('stats-section');
    statsSection.classList.add('show');

    // Seleccionamos el enlace del menú inferior que corresponde a la sección de estadísticas y lo mostramos como activo
    const statsLink = document.querySelector('.footer-link[data-section="stats-section"]');
    statsLink.classList.add('active'); // Agregar 'active' al enlace de estadísticas
    statsLink.querySelector('i').classList.add('active'); // Agregar 'active' al icono de estadísticas

    // Seleccionamos todos los enlaces del menú inferior
    const footerLinks = document.querySelectorAll('.footer-link');
    
    // Agregamos un evento de clic a cada enlace
    footerLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar el comportamiento predeterminado del enlace

            // Obtenemos el ID de la sección que se debe mostrar
            const sectionId = link.getAttribute('data-section');
            const sections = document.querySelectorAll('.stats-section, .order-section, .develop1-section, .develop2-section');

            // Ocultamos todas las secciones
            sections.forEach((section) => {
                section.classList.remove('show'); // Ocultar la sección
                section.classList.add('hide'); // Agregar clase 'hide'
            });

            // Mostramos la sección seleccionada
            const selectedSection = document.getElementById(sectionId);
            selectedSection.classList.remove('hide'); // Quitar la clase 'hide'
            selectedSection.classList.add('show'); // Agregar la clase 'show'

            // Eliminamos la clase 'active' de todos los enlaces y sus iconos
            footerLinks.forEach((footerLink) => {
                footerLink.classList.remove('active'); // Eliminar 'active' del enlace
                footerLink.querySelector('i').classList.remove('active'); // Eliminar 'active' del icono
            });

            // Agregar 'active' al enlace clicado y a su icono
            link.classList.add('active'); // Agregar 'active' al enlace clicado
            link.querySelector('i').classList.add('active'); // Agregar 'active' al icono clicado
        });
    });
});