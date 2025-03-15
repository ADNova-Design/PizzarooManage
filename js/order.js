  
  // Comprobar si hay información guardada en el almacenamiento local
if (!localStorage.getItem('usuario') || localStorage.getItem('usuario') === '') {
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
}
	
// **Buscar**
const searchInput = document.getElementById('inputSearch');
const googleAppScriptDataContainer = document.getElementById('google-app-script-data');

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const cards = googleAppScriptDataContainer.children;

  if (searchTerm === '') {
    // Restablecer el estilo de las tarjetas si el campo de búsqueda está vacío
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.style.display = 'block';
      card.classList.remove('match');
    }
  } else {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardText = card.textContent.toLowerCase();

      if (cardText.includes(searchTerm)) {
        card.style.display = 'block';
        card.classList.add('match');
      } else {
        card.style.display = 'none';
        card.classList.remove('match');
      }
    }
  }
});


// **Ordenar datos**
// Variables para almacenar el orden actual de los datos
let ordenNombre = 'asc';
let ordenFecha = 'asc';

// Función para ordenar los datos por nombre
function ordenarPorNombre() {
  const cards = googleAppScriptDataContainer.children;
  const arrayCards = Array.from(cards);
  arrayCards.sort((a, b) => {
    const nombreA = a.querySelector('h3').textContent;
    const nombreB = b.querySelector('h3').textContent;
    if (ordenNombre === 'asc') {
      return nombreA.localeCompare(nombreB);
    } else {
      return nombreB.localeCompare(nombreA);
    }
  });
  
  // Mostrar indicador visual del orden
  const button = document.getElementById('btn-filtro-az');
  const icon = button.querySelector('i');
  icon.className = ordenNombre === 'asc' ? 'fas fa-sort-alpha-down mr-2 text-pizza-red' : 'fas fa-sort-alpha-up mr-2 text-pizza-red';
  
  googleAppScriptDataContainer.innerHTML = '';
  arrayCards.forEach(card => {
    googleAppScriptDataContainer.appendChild(card);
  });
  ordenNombre = ordenNombre === 'asc' ? 'desc' : 'asc';
}

// Función para ordenar los datos por fecha
function ordenarPorFecha() {
  const cards = googleAppScriptDataContainer.children;
  const arrayCards = Array.from(cards);
  arrayCards.sort((a, b) => {
    // Obtener el texto de la fecha buscando primero el contenedor
    const fechaDivA = Array.from(a.querySelectorAll('.text-xs.text-gray-400')).find(el => el.textContent === 'Fecha de Pedido').parentElement;
    const fechaDivB = Array.from(b.querySelectorAll('.text-xs.text-gray-400')).find(el => el.textContent === 'Fecha de Pedido').parentElement;
    
    const fechaTextoA = fechaDivA.querySelector('.text-sm.font-medium').textContent.trim();
    const fechaTextoB = fechaDivB.querySelector('.text-sm.font-medium').textContent.trim();
    
    // Convertir el formato DD/MM/YYYY, HH:mm:ss a objeto Date
    const [fechaA, horaA] = fechaTextoA.split(', ');
    const [diaA, mesA, yearA] = fechaA.split('/');
    const fechaObjetoA = new Date(`${yearA}-${mesA}-${diaA}T${horaA}`);

    const [fechaB, horaB] = fechaTextoB.split(', ');
    const [diaB, mesB, yearB] = fechaB.split('/');
    const fechaObjetoB = new Date(`${yearB}-${mesB}-${diaB}T${horaB}`);
    
    if (ordenFecha === 'asc') {
      return fechaObjetoA - fechaObjetoB;
    } else {
      return fechaObjetoB - fechaObjetoA;
    }
  });
  
  // Mostrar indicador visual del orden
  const button = document.getElementById('btn-filtro-fecha');
  const icon = button.querySelector('i');
  icon.className = ordenFecha === 'asc' ? 'fas fa-calendar-alt mr-2 text-pizza-red' : 'fas fa-calendar mr-2 text-pizza-red';
  
  googleAppScriptDataContainer.innerHTML = '';
  arrayCards.forEach(card => {
    googleAppScriptDataContainer.appendChild(card);
  });
  ordenFecha = ordenFecha === 'asc' ? 'desc' : 'asc';
}

// Agregar eventos a los botones de filtrado con feedback visual
document.getElementById('btn-filtro-az').addEventListener('click', () => {
  ordenarPorNombre();
  showToast(ordenNombre === 'asc' ? 'Ordenando nombres de A a Z' : 'Ordenando nombres de Z a A', 'info');
});

document.getElementById('btn-filtro-fecha').addEventListener('click', () => {
  ordenarPorFecha();
  showToast(ordenFecha === 'asc' ? 'Ordenando por fecha más antigua' : 'Ordenando por fecha más reciente', 'info');
});

// Define the cargarDatos function
function cargarDatos() {
  // Mostrar el mensaje de carga y los skeletons
  const loadingMessage = document.getElementById('loading-message');
  const container = document.getElementById('google-app-script-data');
  loadingMessage.classList.remove('hidden');
  
  // Limpiar el contenedor y agregar skeletons
  container.innerHTML = '';
  for(let i = 0; i < 6; i++) { // Mostrar 6 skeletons
    const skeletonCard = document.createElement('div');
    skeletonCard.className = 'skeleton-card';
    skeletonCard.innerHTML = `
      <div class="skeleton-line skeleton-title"></div>
      <div class="space-y-2">
        <div class="skeleton-line skeleton-text medium"></div>
        <div class="skeleton-line skeleton-text short"></div>
        <div class="skeleton-line skeleton-text full"></div>
        <div class="skeleton-line skeleton-text full"></div>
        <div class="skeleton-line skeleton-text medium"></div>
        <div class="skeleton-line skeleton-text short"></div>
        <div class="skeleton-line skeleton-text medium"></div>
        <div class="skeleton-line skeleton-text full"></div>
        <div class="skeleton-line skeleton-text medium mt-4"></div>
      </div>
      <div class="skeleton-line skeleton-text full mt-2"></div>
    `;
    container.appendChild(skeletonCard);
  }
  
  // Cargar datos desde Google App Script
  fetch('https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec')
    .then(response => response.json())
    .then(data => {
      // Sort data by date in descending order (newest first)
      data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
      
      // Limpiar los skeletons
      container.innerHTML = '';
      
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md';
        
        const fecha = new Date(item.Fecha);
        const fechaFormat = fecha.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        
        const horaEntrega = item['Hora de entrega'];
        const cuentaRegresiva = document.createElement('div');
        cuentaRegresiva.className = 'mt-4 p-3 rounded-lg text-center text-sm font-medium bg-green-100';
        
        card.innerHTML = `
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-pizza-dark">${item.Nombre}</h3>
            <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Código: ${item.Código}</span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha de Pedido</p>
                <p class="text-sm font-medium text-gray-600">${fechaFormat}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Hora de Entrega</p>
                <p class="text-sm font-medium text-gray-600">${horaEntrega}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
                <p class="text-sm font-medium text-gray-600">${item.Teléfono}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Dirección</p>
                <p class="text-sm font-medium text-gray-600">${item.Dirección}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Punto de Referencia</p>
                <p class="text-sm font-medium text-gray-600">${item['Punto de referencia'] || 'No especificado'}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Estado SMS</p>
                <p class="text-sm font-medium text-gray-600">${item.SMS}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">Productos</p>
            <p class="text-sm font-medium text-gray-600 mb-4">${item.Productos}</p>
            
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-400 uppercase tracking-wider">Total</p>
              <p class="text-lg font-bold text-pizza-red">${item.Total}</p>
            </div>
          </div>
        `;
        
        card.appendChild(cuentaRegresiva);
        container.appendChild(card);
        actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, item.Fecha);
      });
      
      // Ocultar el mensaje de carga
      loadingMessage.classList.add('hidden');
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('Error al cargar los datos. Por favor, intente nuevamente.', 'error');
      loadingMessage.classList.add('hidden');
    });
}

// Call the cargarDatos function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  cargarDatos();
});

function actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, fecha) {
  // Convertir la hora de entrega a un formato que pueda ser procesado por JavaScript
  let horaEntregaFormat;
  if (horaEntrega.includes('AM') || horaEntrega.includes('PM')) {
    // Formato "HH:mm AM/PM"
    const partes = horaEntrega.split(' ');
    const hora = partes[0].split(':');
    const ampm = partes[1];
    let hora24 = parseInt(hora[0]);
    if (ampm === 'PM' && hora24 !== 12) {
      hora24 += 12;
    } else if (ampm === 'AM' && hora24 === 12) {
      hora24 = 0;
    }
    horaEntregaFormat = new Date(fecha);
    horaEntregaFormat.setHours(hora24);
    horaEntregaFormat.setMinutes(parseInt(hora[1]));
    horaEntregaFormat.setSeconds(0);
  } else {
    // Formato "HH:mm"
    const partes = horaEntrega.split(':');
    horaEntregaFormat = new Date(fecha);
    horaEntregaFormat.setHours(parseInt(partes[0]));
    horaEntregaFormat.setMinutes(parseInt(partes[1]));
    horaEntregaFormat.setSeconds(0);
  }

  const ahora = new Date();
  const diferencia = horaEntregaFormat.getTime() - ahora.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  if (diferencia <= 30 * 60 * 1000) {
    cuentaRegresiva.classList.remove('bg-green-100');
    cuentaRegresiva.style.background = 'red';
    cuentaRegresiva.style.color = 'white';
  }
  if (diferencia <= 0) {
    cuentaRegresiva.textContent = 'Tiempo Agotado';
    cuentaRegresiva.classList.remove('bg-green-100');
    cuentaRegresiva.style.background = 'red';
    cuentaRegresiva.style.color = 'white';
  } else {
    cuentaRegresiva.textContent = `${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }
  setTimeout(() => {
    actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, fecha);
  }, 1000);
}

// **Actualizar**
	document.getElementById('btn-actualizar').addEventListener('click', function() {
  showToast('Actualizando datos...', 'info');
  cargarDatos();
});

// Add countdown timer to refresh data
let tiempoRecarga = 3 * 60; // 10 minutos en segundos
let cuentaRegresivaRecarga = document.getElementById('cuenta-regresiva-recarga');

setInterval(() => {
  tiempoRecarga--;
  const minutos = Math.floor(tiempoRecarga / 60);
  const segundos = tiempoRecarga % 60;
  const minutosString = minutos < 10 ? `0${minutos}` : `${minutos}`;
  const segundosString = segundos < 10 ? `0${segundos}` : `${segundos}`;
  cuentaRegresivaRecarga.textContent = `${minutosString}:${segundosString}`;
  if (tiempoRecarga <= 0) {
    document.getElementById('google-app-script-data').innerHTML = 'Cargando...';
    cargarDatos();
    tiempoRecarga = 3 * 60; // Resetear el tiempo de recarga a 10 minutos
  }
}, 1000);


// Skeleton Preloader
document.addEventListener("DOMContentLoaded", function() {
  const row = document.querySelector('.row');
  const loadingMessage = document.getElementById('loading-message');

  // Mostrar el mensaje de carga
  loadingMessage.style.display = 'block';

  // Simular carga de datos
  setTimeout(() => {
    loadingMessage.style.display = 'none'; // Ocultar mensaje de carga

    // Limpiar el contenido anterior
    row.innerHTML = '';

    // Establecer un ancho fijo para los skeletons
    const fixedWidth = '300px'; // Ancho fijo deseado

    // Simular la creación de 4 grupos de 3 elementos de datos
    for (let j = 0; j < 5; j++) { // Repetir 4 veces 
      for (let i = 0; i < 5; i++) { // Crear 3 skeletons por grupo
        const skeletonDiv = document.createElement('div');      
        skeletonDiv.className = 'skeleton';
        skeletonDiv.style.width = fixedWidth; // Ancho fijo
        skeletonDiv.style.alignItems = 'center'; // Ancho fijo
        row.appendChild(skeletonDiv);
      }
      // Añadir un separador entre grupos, si es necesario
      const separator = document.createElement('div');
      separator.style.height = '20px'; // Espacio entre grupos
      row.appendChild(separator);
    }
  }, 3000); // Simula una carga de 3 segundos
});
	