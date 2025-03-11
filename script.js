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

   // Obter o valor da "Comum Congregação" selecionada
   const comumCongregacao = document.getElementById("congregationInput").value;

   // Obter o ano da data de início
   const startDateInput = document.getElementById('startDateInput');
   const startYear = new Date(startDateInput.value).getFullYear();
 
   // Cria o título e o contêiner para o PDF
   const pdfElement = document.createElement('div');
   const title = document.createElement('div');
   title.className = 'pdf-title';
   
   // Formata o título conforme solicitado
   title.innerHTML = `ESCALA DE AUXILIARES<br>${comumCongregacao.toUpperCase()}<br>${startYear}`;
   title.style.textAlign = 'center';
   title.style.fontWeight = 'bold';
   title.style.fontSize = '18px';
   title.style.marginBottom = '20px'; // Adiciona espaçamento abaixo do título
   
   pdfElement.appendChild(title);

  // Clone a tabela e agrupe por mês
  const clonedTable = tableElement.cloneNode(true);
  const rows = clonedTable.querySelectorAll("tr");

  // Objeto para armazenar tabelas agrupadas por mês
  const monthsGrouped = {};

  rows.forEach(row => {
    const dateCell = row.querySelector("td"); // A primeira célula da linha é a data
    if (dateCell) {
      // Extraímos a data como string (assumimos o formato "dd/mm/yyyy")
      const dateStr = dateCell.textContent;
      
      // Se a data estiver no formato "dd/mm/yyyy", separamos em partes e criamos um objeto Date
      const [day, month, year] = dateStr.split('/').map(Number); // Converte as partes para números
      const date = new Date(year, month - 1, day); // Mês em JavaScript é zero-indexado (0 = Janeiro, 1 = Fevereiro, etc.)
      
      // Obtemos o nome do mês
      const monthName = date.toLocaleString("pt-BR", { month: "long" }); // Exemplo: Janeiro, Fevereiro

      // Exibimos o dia e o número do mês no formato "dd/mm" com zero à esquerda quando necessário
      const dayAndMonth = `${day < 10 ? '0' + day : day}/${month + 1 < 10 ? '0' + (month) : month + 1}`;

      // Atualiza a célula da data no PDF com o novo formato
      dateCell.textContent = dayAndMonth; // Exibe no formato "dd Mês"

      // Se o mês ainda não existir no objeto, cria uma nova chave para ele
      if (!monthsGrouped[monthName]) {
        monthsGrouped[monthName] = [];
      }

      // Adiciona a linha à tabela do respectivo mês
      monthsGrouped[monthName].push(row);
    }
  });

  // Agora, para cada mês, cria uma nova tabela com o título do mês
  for (const month in monthsGrouped) {
    
    const monthTitle = document.createElement('div');
    monthTitle.textContent = month;
    monthTitle.textContent = month.toUpperCase();
    monthTitle.style.textAlign = 'center'; // Centraliza o título
    monthTitle.style.fontWeight = 'bold'; // Aplica o negrito ao título do mês
    monthTitle.style.marginTop = '20px'; // Adiciona margem superior para separar do conteúdo anterior
    pdfElement.appendChild(monthTitle);

    // Cria a tabela para esse mês
    const monthTable = document.createElement('table');

    // Adiciona o cabeçalho à tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ["Data", "Oração", "Crianças", "Meninos(as)", "Moços(as)", "Individuais"];
    
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    monthTable.appendChild(thead);

    // Adiciona as linhas desse mês à tabela
    const tbody = document.createElement('tbody');
    monthsGrouped[month].forEach(row => {
      tbody.appendChild(row);
    });

    monthTable.appendChild(tbody);

    // Adiciona a tabela ao PDF
    pdfElement.appendChild(monthTable);
  }

  // Configura as opções para o html2pdf
  const opt = {
    margin: [0.1, 1, 1, 1], // Define a margem do topo menor (0.5) e as margens laterais (1)
    filename: 'rodizio-auxiliares.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait'}
  };

  // Gera o PDF com as tabelas agrupadas por mês
  html2pdf().set(opt).from(pdfElement).save();
}



  