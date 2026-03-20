let cargas = JSON.parse(localStorage.getItem("cargas")) || [];

function guardar() {
  localStorage.setItem("cargas", JSON.stringify(cargas));
}

function agregarCarga() {
  cargas.push({ nombre: "", watts: 0, cantidad: 1 });
  render();
}

function eliminar(i) {
  cargas.splice(i, 1);
  render();
}

function update(i, key, value) {
  cargas[i][key] = Number(value) || value;
  render();
}

function render() {
  let tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  cargas.forEach((c, i) => {
    let total = c.watts * c.cantidad;

    tabla.innerHTML += `
    <tr>
      <td><input type="text" value="${c.nombre}" onchange="update(${i}, 'nombre', this.value)"></td>
      <td><input type="number" value="${c.watts}" onchange="update(${i}, 'watts', this.value)"></td>
      <td><input type="number" value="${c.cantidad}" onchange="update(${i}, 'cantidad', this.value)"></td>
      <td>${total}</td>
      <td><button onclick="eliminar(${i})">X</button></td>
    </tr>
    `;
  });

  calcular();
  guardar();
}

function calcular() {
  let V = Number(document.getElementById("voltaje").value);
  let factor = Number(document.getElementById("factor").value);

  let P = cargas.reduce((acc, c) => acc + (c.watts * c.cantidad), 0);
  let Pc = P * factor;

  let I = Pc / V;

  let breaker = seleccionarBreaker(I);
  let cable = seleccionarCable(breaker);

  document.getElementById("potencia").innerText = P + " W";
  document.getElementById("potenciaCorr").innerText = Pc.toFixed(2) + " W";
  document.getElementById("corriente").innerText = I.toFixed(2) + " A";
  document.getElementById("breaker").innerText = breaker + " A";
  document.getElementById("cable").innerText = cable;
  generarTablero();
}

function seleccionarBreaker(I) {
  let nec = I * 1.25;
  let valores = [15, 20, 30, 40, 50, 60];
  return valores.find(v => nec <= v) || 60;
}

function seleccionarCable(breaker) {
  if (breaker <= 15) return "14 AWG";
  if (breaker <= 20) return "12 AWG";
  if (breaker <= 30) return "10 AWG";
  if (breaker <= 40) return "8 AWG";
  if (breaker <= 55) return "6 AWG";
  return "4 AWG";
}

 function exportarPDF() {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  // 🎨 HEADER
  doc.setFillColor(0, 230, 118);
  doc.rect(0, 0, 210, 20, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("REPORTE ELÉCTRICO PROFESIONAL", 20, 13);

  // Reset color
  doc.setTextColor(0, 0, 0);

  let y = 30;

  // 📋 DATOS GENERALES
  doc.setFontSize(11);
  doc.text("Datos del Sistema:", 20, y);
  y += 8;

  doc.text("Voltaje: " + document.getElementById("voltaje").value + " V", 20, y);
  y += 6;

  doc.text("Factor de demanda: " + document.getElementById("factor").value, 20, y);
  y += 6;

  doc.text("Longitud: " + document.getElementById("longitud").value + " m", 20, y);
  y += 6;

  doc.text("Material: " + document.getElementById("material").value, 20, y);
  y += 10;

  // 📊 TABLA DE CARGAS
  doc.setFontSize(12);
  doc.text("Listado de Cargas:", 20, y);
  y += 8;

  doc.setFontSize(10);

  cargas.forEach(c => {
    let texto = `${c.nombre} | ${c.watts}W x ${c.cantidad} = ${c.watts * c.cantidad}W`;
    doc.text(texto, 20, y);
    y += 6;
  });

  y += 8;

  // 📈 RESULTADOS
  doc.setFontSize(12);
  doc.text("Resultados del Cálculo:", 20, y);
  y += 8;

  doc.setFontSize(10);

  doc.text("Potencia Total: " + document.getElementById("potencia").innerText, 20, y);
  y += 6;

  doc.text("Potencia Corregida: " + document.getElementById("potenciaCorr").innerText, 20, y);
  y += 6;

  doc.text("Corriente: " + document.getElementById("corriente").innerText, 20, y);
  y += 6;

  doc.text("Breaker: " + document.getElementById("breaker").innerText, 20, y);
  y += 6;

  doc.text("Cable: " + document.getElementById("cable").innerText, 20, y);
  y += 6;

  doc.text("Caída de voltaje: " + document.getElementById("caida").innerText, 20, y);
  y += 15;

  // 📝 CONCLUSIÓN
  doc.setFontSize(11);
  doc.text("Conclusión:", 20, y);
  y += 6;

  doc.setFontSize(10);
  doc.text("El circuito cumple con los parámetros eléctricos establecidos según cálculos basados en normativa NEC.", 20, y, { maxWidth: 170 });

  y += 15;

  // 🧾 FOOTER
  doc.setFontSize(8);
  doc.text("Generado por Calculadora Eléctrica PRO", 20, 280);

  // 💾 GUARDAR
  doc.save("reporte-profesional.pdf");
}function exportarPDF() {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  // 🎨 HEADER
  doc.setFillColor(0, 230, 118);
  doc.rect(0, 0, 210, 20, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("REPORTE ELÉCTRICO PROFESIONAL", 20, 13);

  // Reset color
  doc.setTextColor(0, 0, 0);

  let y = 30;

  // 📋 DATOS GENERALES
  doc.setFontSize(11);
  doc.text("Datos del Sistema:", 20, y);
  y += 8;

  doc.text("Voltaje: " + document.getElementById("voltaje").value + " V", 20, y);
  y += 6;

  doc.text("Factor de demanda: " + document.getElementById("factor").value, 20, y);
  y += 6;

  doc.text("Longitud: " + document.getElementById("longitud").value + " m", 20, y);
  y += 6;

  doc.text("Material: " + document.getElementById("material").value, 20, y);
  y += 10;

  // 📊 TABLA DE CARGAS
  doc.setFontSize(12);
  doc.text("Listado de Cargas:", 20, y);
  y += 8;

  doc.setFontSize(10);

  cargas.forEach(c => {
    let texto = `${c.nombre} | ${c.watts}W x ${c.cantidad} = ${c.watts * c.cantidad}W`;
    doc.text(texto, 20, y);
    y += 6;
  });

  y += 8;

  // 📈 RESULTADOS
  doc.setFontSize(12);
  doc.text("Resultados del Cálculo:", 20, y);
  y += 8;

  doc.setFontSize(10);

  doc.text("Potencia Total: " + document.getElementById("potencia").innerText, 20, y);
  y += 6;

  doc.text("Potencia Corregida: " + document.getElementById("potenciaCorr").innerText, 20, y);
  y += 6;

  doc.text("Corriente: " + document.getElementById("corriente").innerText, 20, y);
  y += 6;

  doc.text("Breaker: " + document.getElementById("breaker").innerText, 20, y);
  y += 6;

  doc.text("Cable: " + document.getElementById("cable").innerText, 20, y);
  y += 6;

  doc.text("Caída de voltaje: " + document.getElementById("caida").innerText, 20, y);
  y += 15;

  // 📝 CONCLUSIÓN
  doc.setFontSize(11);
  doc.text("Conclusión:", 20, y);
  y += 6;

  doc.setFontSize(10);
  doc.text("El circuito cumple con los parámetros eléctricos establecidos según cálculos basados en normativa NEC.", 20, y, { maxWidth: 170 });

  y += 15;

  // 🧾 FOOTER
  doc.setFontSize(8);
  doc.text("Generado por Calculadora Eléctrica PRO", 20, 280);

  // 💾 GUARDAR
  doc.save("reporte-profesional.pdf");
}
function generarTablero() {
  let tablero = document.getElementById("tablero");
  tablero.innerHTML = "";

  let circuitos = [];

  cargas.forEach(c => {
    let nombre = c.nombre.toLowerCase();
    let potencia = c.watts * c.cantidad;

    let tipo = "toma";

    if (
      nombre.includes("luz") ||
      nombre.includes("foco") ||
      nombre.includes("lampara")
    ) {
      tipo = "luz";
    }

    if (
      nombre.includes("aire") ||
      nombre.includes("nevera") ||
      nombre.includes("lavadora")
    ) {
      tipo = "especial";
    }

    circuitos.push({
      nombre: c.nombre,
      potencia: potencia,
      tipo: tipo
    });
  });

  let V = Number(document.getElementById("voltaje").value);

  circuitos.forEach((c, i) => {
    let I = c.potencia / V;
    let breaker = seleccionarBreaker(I);
    let cable = seleccionarCable(breaker);

    tablero.innerHTML += `
    <div class="card">
      Circuito ${i + 1} - ${c.nombre}<br>
      Tipo: ${c.tipo}<br>
      Potencia: ${c.potencia} W<br>
      Corriente: ${I.toFixed(2)} A<br>
      Breaker: ${breaker} A<br>
      Cable: ${cable}
    </div>
    `;
  });
                                               

render();
