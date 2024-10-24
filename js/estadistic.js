document.addEventListener("DOMContentLoaded", function() {
  getOrderData();
  updateIncomeData();
});

function getOrderData() {
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec", true);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      var responseText = xhr.responseText.trim();
      var jsonData = JSON.parse(responseText);
      
      // Aquí puedes manejar los datos de la hoja "BD"
      var count = jsonData.length; // Cambia esto según lo que necesites
      console.log("Número de filas con datos:", count);
      document.getElementById("orders-data").innerHTML = count;      
    } 
  };
  
  xhr.send();
}


function updateIncomeData() {
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec", true);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      console.log("Datos recibidos de la API:", data); // Verificar la respuesta aquí

      var incomeDataElement = document.getElementById("income-data");
      if (incomeDataElement) {
        if (data.income !== undefined) {
          // Formatear el valor para mostrar dos decimales
          var formattedIncome = parseFloat(data.income).toFixed(2);
          incomeDataElement.textContent = formattedIncome; // Mostrar el valor recibido
        } else {
          console.error("El total de ingresos no está definido.");
          incomeDataElement.textContent = "0.00";
        }
      }
    } else {
      console.error("Error al obtener los datos de ingresos.");
    }
  };
  
  xhr.send();
}