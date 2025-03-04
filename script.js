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

  // Pega a quantidade de nomes digitados
  const numberOfNames = names.length;

  // Exibe a quantidade de nomes no console (ou você pode exibir em algum lugar na interface)
  console.log(`Quantidade de nomes digitados: ${numberOfNames}`);

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

  // Se o número de nomes for 5, aplicamos a lógica de alternância cíclica
  if (numberOfNames === 5) {
    let nameIndex = 0; // Índice para a rotação dos nomes

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

      // Alterna os nomes nas 5 colunas, fazendo a rotação
      for (let colIndex = 1; colIndex <= 5; colIndex++) {
        const td = document.createElement("td");

        // Atribui o nome com rotação cíclica
        td.textContent = names[(nameIndex + colIndex - 1) % 5];
        td.contentEditable = "true"; // Torna a célula editável
        row.appendChild(td);
      }

      tbody.appendChild(row);

      // Avança para a próxima data (a cada 7 dias)
      date.setDate(date.getDate() + 7);

      // Incrementa o índice para a rotação dos nomes
      nameIndex = (nameIndex + 1) % 5;
    }
  } else {
    // Se o número de nomes não for 5, aplica a lógica padrão de alternância (como já estava antes)
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

      // Alterna os nomes nas colunas
      headers.slice(1).forEach((header, index) => {
        const td = document.createElement("td");

        // Atribui o nome da pessoa alternando a cada célula (baseado na lógica de 5 nomes)
        td.textContent = names[nameIndex];
        td.contentEditable = "true"; // Torna a célula editável
        row.appendChild(td);

        // A alternância de nomes ocorre aqui (baseada na lógica que você pediu)
        nameIndex = (nameIndex + 1) % names.length; // Alterna entre os nomes
      });

      tbody.appendChild(row);

      // Avança para a próxima data (a cada 7 dias)
      date.setDate(date.getDate() + 7);
    }
  }

  table.appendChild(tbody);

  // Exibe o botão de gerar PDF
  document.getElementById('generatePDFButton').style.display = 'block';
}


function updateTable() {
  const namesInput = document.getElementById("namesInput").value;
  const names = namesInput.split(",").map(name => name.trim()).filter(name => name); // Remove espaços e nomes vazios

  const numberOfNames = names.length;

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