function fetchData() {
  const url = 'https://script.google.com/macros/s/AKfycbw-ggVGuD3Unk1FcdhaGonBc_3Wwd2Th9f8tFDqgMij3gWKJ_GxCwg7gSxpIaILXyO3/exec';
      
  console.log("Solicitando datos:"); // Log para verificar la URL
  
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          console.log("Data received:", data); // Log para verificar los datos recibidos
          
          // Verificar que los datos contienen las propiedades esperadas
          const ordersTotal = data.ordersTotal; // Órdenes Totales desde A2
          const incomeTotal = data.incomeTotal; // Ingresos Totales desde E2
          const ordersDaily = data.ordersDaily; // Órdenes Totales desde B2
          const incomeDaily = data.incomeDaily; // Ingresos Totales desde F2
          const ordersWeek = data.ordersWeek; // Órdenes Totales desde C2
          const incomeWeek = data.incomeWeek; // Ingresos Totales desde G2
          const ordersMonth = data.ordersMonth; // Órdenes Totales desde D2
          const incomeMonth = data.incomeMonth; // Ingresos Totales desde H2
          
          // Actualizar el HTML con los datos obtenidos
          document.getElementById('orders-data').innerText = ordersTotal;
          document.getElementById('income-data').innerText = incomeTotal;
          document.getElementById('orders-daily-data').innerText = ordersDaily;
          document.getElementById('income-daily-data').innerText = incomeDaily;
          document.getElementById('orders-week-data').innerText = ordersWeek;
          document.getElementById('income-week-data').innerText = incomeWeek;
          document.getElementById('orders-month-data').innerText = ordersMonth;
          document.getElementById('income-month-data').innerText = incomeMonth;

          // Log para depuración
          console.log("Órdenes Totales:", ordersTotal);
          console.log("Ingresos Totales:", incomeTotal);

          console.log("Órdenes Diarias:", ordersDaily);
          console.log("Ingresos Diarios:", incomeDaily);

          console.log("Órdenes Semanales:", ordersWeek);
          console.log("Ingresos Semanales:", incomeWeek);
          
          console.log("Órdenes Mensuales:", ordersMonth);
          console.log("Ingresos Mensuales:", incomeMonth);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}

// Llama a la función fetchData al cargar la página
window.onload = function() {
  fetchData(); // Llamar a fetchData cuando la página se carga

  // Configurar la recarga de datos cada 1 minuto (60000 milisegundos)
  setInterval(fetchData, 30000);
};

document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const statsContainer = document.getElementById('total');

  // Función para actualizar los datos según el período seleccionado
  function actualizarDatos(periodo) {
    const ordersData = document.getElementById('orders-data');
    const incomeData = document.getElementById('income-data');
    
    // Simulación de datos para cada período
    const datos = {
      'total': { orders: '1,234', income: '$45,678' },
      'diario': { orders: '42', income: '$1,560' },
      'semanal': { orders: '286', income: '$10,450' },
      'mensual': { orders: '890', income: '$32,780' }
    };

    // Animación de los números
    animateValue(ordersData, datos[periodo].orders);
    animateValue(incomeData, datos[periodo].income);
  }

  // Función para animar los valores
  function animateValue(element, value) {
    element.style.opacity = '0';
    setTimeout(() => {
      element.textContent = value;
      element.style.opacity = '1';
    }, 200);
  }

  // Manejar clics en las tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remover clase activa de todas las tabs
      tabs.forEach(t => {
        t.classList.remove('active', 'bg-white', 'shadow-sm');
        t.classList.add('inactive', 'hover:bg-gray-50');
      });

      // Agregar clase activa a la tab seleccionada
      tab.classList.remove('inactive', 'hover:bg-gray-50');
      tab.classList.add('active', 'bg-white', 'shadow-sm');

      // Actualizar datos según el período
      const periodo = tab.getAttribute('data-period');
      actualizarDatos(periodo);
    });
  });

  // Inicializar con los datos totales
  actualizarDatos('total');
});