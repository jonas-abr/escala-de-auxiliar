function showAlert(message, type = 'info') {
  const alertElement = document.getElementById('alert');
  const alertMessage = document.getElementById('alertMessage');

  alertMessage.textContent = message;
  alertElement.className = `alert ${type}`;
  alertElement.style.display = 'block';
}

function closeAlert() {
  document.getElementById('alert').style.display = 'none';
}

function createTable(names, startDate, endDate) {
  const table = document.getElementById("auxTable");
  const headers = [
    "Data",
    "Oração",
    "Crianças",
    "Meninos(as)",
    "Moços(as)",
    "Individuais",
  ];

  // Limpa a tabela existente
  table.innerHTML = '';

  // Cria o cabeçalho da tabela
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Cria o corpo da tabela
  const tbody = document.createElement("tbody");

  let date = new Date(startDate);
  endDate = new Date(endDate);
  let nameIndex = 0;

  while (date <= endDate) {
    const row = document.createElement("tr");

    // Adiciona a data
    const dateCell = document.createElement("td");
    dateCell.textContent = date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    row.appendChild(dateCell);

    // Adiciona os nomes alternados e torna as células editáveis
    headers.slice(1).forEach(() => {
      const td = document.createElement("td");
      td.textContent = names[nameIndex];
      td.contentEditable = "true"; // Torna a célula editável
      row.appendChild(td);
      nameIndex = (nameIndex + 1) % names.length; // Alterna entre os nomes
    });

    tbody.appendChild(row);

    // Avança para o próximo domingo
    date.setDate(date.getDate() + 7);
  }

  table.appendChild(tbody);

  // Exibe o botão de gerar PDF
  document.getElementById('generatePDFButton').style.display = 'block';
}

function updateTable() {
  const namesInput = document.getElementById("namesInput").value;
  const names = namesInput.split(",").map(name => name.trim()).filter(name => name); // Remove espaços e nomes vazios

  const startDateInput = document.getElementById("startDateInput").value;
  const endDateInput = document.getElementById("endDateInput").value;

  // Define startDate como a data fornecida, ajustando para o início do dia
  const startDate = startDateInput ? new Date(startDateInput + 'T00:00:00') : new Date();

  // Define endDate como a data fornecida ou a data atual mais 6 meses
  const endDate = endDateInput ? new Date(endDateInput + 'T23:59:59') : (() => {
      const today = new Date(); // Pega a data atual
      const sixMonthsLater = new Date(today); // Cria uma nova instância de data com a data atual
      sixMonthsLater.setMonth(today.getMonth() + 6); // Adiciona 6 meses
      sixMonthsLater.setHours(23, 59, 59, 999); // Ajusta para o final do dia
      return sixMonthsLater; // Retorna a data com 6 meses adicionados
  })();

  if (names.length === 0) {
    showAlert("Por favor, insira pelo menos um nome.", "warning");
    return;
  }

  if (startDate > endDate) {
    showAlert("A data de início não pode ser posterior à data de fim.", "warning");
    return;
  }

  createTable(names, startDate, endDate);
}

function generatePDF() {
    const tableElement = document.querySelector("#auxTable");

    // Cria o título e a tabela para o PDF
    const pdfElement = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'pdf-title';
    title.textContent = 'Lista de Auxiliares';

    pdfElement.appendChild(title);
    pdfElement.appendChild(tableElement.cloneNode(true)); // Clona a tabela para o PDF

    // Configura as opções para o html2pdf
    const opt = {
      margin: 1,
      filename: 'rodizio-auxiliares.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(pdfElement).save();
  }