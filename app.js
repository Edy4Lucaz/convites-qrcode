const readerElementId = "reader";
const resultBox = document.getElementById("result-box");
const resultCasal = document.getElementById("result-casal"); 
const statusMessage = document.getElementById("status-message");
const resetButton = document.getElementById("reset-button");
const adminContent = document.getElementById('admin-content');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const newGuestIdDisplay = document.getElementById('new-guest-id');
const listOutput = document.getElementById('guest-list-output'); 

let html5QrcodeScanner;
let listaConvidados = [];

const DB_KEY = 'convites_presenca';


/* --- LÓGICA DE BD E CARREGAMENTO --- */

async function loadGuestList() {
    try {
        const savedList = localStorage.getItem(DB_KEY);
        if (savedList) {
            listaConvidados = JSON.parse(savedList);
            statusMessage.textContent = `Lista carregada do cache (${listaConvidados.length} entradas).`;
        } else {
            listaConvidados = [];
            statusMessage.textContent = `Lista inicializada. Adicione convidados via Admin.`;
        }
    } catch (error) {
        statusMessage.textContent = `ERRO CRÍTICO ao carregar lista.`;
        console.error("Erro ao carregar lista:", error);
    }
}

function updateAttendance(id) {
    const index = listaConvidados.findIndex(c => c.id === id);
    if (index !== -1) {
        listaConvidados[index].presente = true;
        localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados)); 
    }
}

/* --- FUNÇÕES DE MENU E NAVEGAÇÃO --- */

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        mainContent.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        mainContent.style.marginLeft = "250px";
    }
}
window.toggleSidebar = toggleSidebar;

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
    }
    
    toggleSidebar(); 
    
    if (sectionId === 'list-section') {
        updateListSummary();
        displayGuestList('faltando'); 
    }
    
    if (sectionId === 'reader-section') {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.resume();
        }
    }
}
window.showSection = showSection;

/* --- LÓGICA DE LEITURA E BLOQUEIO --- */

function onScanSuccess(decodedText, decodedResult) {
    html5QrcodeScanner.pause(); 
    resultBox.classList.remove('success', 'error', 'pending');
    resultCasal.textContent = 'A processar...';
    resetButton.style.display = 'block';

    const guestId = decodedText.trim();
    const convidado = listaConvidados.find(c => c.id === guestId);

    if (convidado) {
        if (convidado.presente) {
            resultBox.classList.add('error');
            resultCasal.textContent = `🚫 ERRO: ${convidado.casal} JÁ ESTÁ PRESENTE!`;
        } else {
            resultBox.classList.add('success');
            resultCasal.textContent = `✅ CONVIDADO CONFIRMADO: ${convidado.casal}`;
            updateAttendance(convidado.id);
        }
    } else {
        resultBox.classList.add('error');
        resultCasal.textContent = 'ERRO: Convite não encontrado. Acesso Negado.';
    }
}

function startScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(
        readerElementId, 
        { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            facingMode: "environment" 
        },
        false 
    );
    html5QrcodeScanner.render(onScanSuccess, (error) => { /* Ignorar erros de ruído */ });

    resetButton.addEventListener('click', () => {
        html5QrcodeScanner.resume();
        resultBox.classList.remove('success', 'error', 'pending');
        resultCasal.textContent = 'Aguardando leitura...';
        resetButton.style.display = 'none';
    });
}


/* --- FUNÇÕES DA LISTA DE PRESENÇA --- */

function updateListSummary() {
    const presentes = listaConvidados.filter(c => c.presente).length;
    const faltando = listaConvidados.filter(c => !c.presente).length;
    const total = listaConvidados.length;
    
    document.getElementById('count-presentes').textContent = presentes;
    document.getElementById('count-faltando').textContent = faltando;
    document.getElementById('count-total').textContent = total;
}

function displayGuestList(status) {
    listOutput.innerHTML = '';
    
    let filteredList;
    if (status === 'presentes') {
        filteredList = listaConvidados.filter(c => c.presente);
    } else if (status === 'faltando') {
        filteredList = listaConvidados.filter(c => !c.presente);
    } else { 
        filteredList = listaConvidados;
    }
        
    filteredList.sort((a, b) => a.casal.localeCompare(b.casal));
    
    if (filteredList.length === 0) {
        listOutput.innerHTML = `<p>Não há convidados nesta categoria.</p>`;
        return;
    }

    // LÓGICA DA TABELA PARA A LISTA GERAL
    if (status === 'geral') {
        let tableHTML = `
            <h3>Lista Geral de Convidados</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nome do Casal/Pessoa</th>
                        <th>Grupo</th>
                        <th>Status</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>`;
        
        filteredList.forEach(convidado => {
            const statusText = convidado.presente ? 'CHEGOU' : 'NÃO CHEGOU';
            const statusClass = convidado.presente ? 'presente' : 'ausente';
            const categoria = convidado.categoria || 'N/A'; 
            
            tableHTML += `
                <tr class="${statusClass}">
                    <td>${convidado.casal}</td>
                    <td>${categoria}</td>
                    <td>${statusText}</td>
                    <td>${convidado.id}</td>
                </tr>`;
        });
        
        tableHTML += `</tbody></table>`;
        listOutput.innerHTML = tableHTML;

    } else { 
        // Lógica de lista simples para Chegados/Não Chegados
        let listHTML = '<ul>';
        filteredList.forEach(convidado => {
            const statusClass = convidado.presente ? 'presente' : 'ausente';
            const statusText = convidado.presente ? 'CHEGOU' : 'NÃO CHEGOU';
            const categoria = convidado.categoria || 'N/A';

            listHTML += `<li class="${statusClass}"><strong>${convidado.casal}</strong> (Grupo: ${categoria}) - ${statusText}</li>`;
        });
        listHTML += '</ul>';
        listOutput.innerHTML = listHTML;
    }
}
window.displayGuestList = displayGuestList;


/* --- FUNÇÕES DO ADMIN --- */

function handleLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    if (user === 'admin' && pass === '1234') {
        loginForm.style.display = 'none';
        adminContent.style.display = 'block';
        loginMessage.textContent = 'Login bem-sucedido!';
        loginMessage.classList.remove('error');
        loginMessage.classList.add('success');
    } else {
        loginMessage.textContent = 'Usuário ou senha incorretos.';
        loginMessage.classList.remove('success');
        loginMessage.classList.add('error');
    }
}
window.handleLogin = handleLogin;

function generateUniqueId(length = 4) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    do {
        id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (listaConvidados.some(c => c.id === id));
    return id;
}

function addGuest() {
    const casalInput = document.getElementById('new-casal');
    const categorySelect = document.getElementById('new-casal-category'); 
    const addMessage = document.getElementById('admin-add-message');
    
    const novoCasal = casalInput.value.trim();
    const novaCategoria = categorySelect.value;
    
    if (!novoCasal) {
        addMessage.textContent = 'Por favor, preencha o nome do casal/pessoa.';
        addMessage.classList.remove('success');
        addMessage.classList.add('error');
        return;
    }

    const newId = generateUniqueId();
    const categoriaDesc = categorySelect.options[categorySelect.selectedIndex].text.split(':')[1].trim();
    
    const newGuest = {
        "id": newId,
        "casal": novoCasal,
        "presente": false,
        "categoria": novaCategoria 
    };

    listaConvidados.push(newGuest);
    localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
    
    addMessage.textContent = `Convidado "${novoCasal}" adicionado com sucesso!`;
    addMessage.classList.remove('error');
    addMessage.classList.add('success');
    
    newGuestIdDisplay.innerHTML = `
        <strong>ID gerado:</strong> 
        <span style="font-size: 1.2em; color: #007bff;">${newId}</span>
        <br>
        <strong>Categoria selecionada:</strong> ${novaCategoria} (${categoriaDesc})
        <p style="font-weight: normal; font-size: 0.9em; margin-top: 10px;">
            * Use o ID <strong>${newId}</strong> e o Tipo <strong>${novaCategoria}</strong> para gerar a imagem QR no seu PC.
        </p>
    `;

    casalInput.value = '';
}
window.addGuest = addGuest;

function deleteGuest() {
    // Pega o valor do campo e remove espaços extras
    const query = document.getElementById('delete-guest-id').value.trim();
    const deleteMessage = document.getElementById('delete-message');

    if (!query) {
        deleteMessage.textContent = 'Por favor, insira o ID ou o Nome do convidado para remover.';
        deleteMessage.classList.add('error');
        deleteMessage.classList.remove('success');
        return;
    }

    const initialLength = listaConvidados.length;
    
    // Converte a consulta para maiúsculas para garantir que a pesquisa não diferencie maiúsculas de minúsculas
    const normalizedQuery = query.toUpperCase();

    // Filtra a lista, mantendo apenas os convidados que NÃO correspondem à consulta
    listaConvidados = listaConvidados.filter(c => {
        // Verifica se o ID do convidado OU o nome (casal) corresponde à consulta
        const idMatch = c.id.toUpperCase() === normalizedQuery;
        const casalMatch = c.casal.toUpperCase() === normalizedQuery;
        
        // Retorna FALSE para convidados que queremos REMOVER (match encontrado)
        return !(idMatch || casalMatch); 
    });

    const guestsRemovedCount = initialLength - listaConvidados.length;

    if (guestsRemovedCount > 0) {
        // Convidado(s) removido(s) com sucesso
        localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
        deleteMessage.textContent = `✅ ${guestsRemovedCount} convidado(s) removido(s) com sucesso pela pesquisa: "${query}".`;
        deleteMessage.classList.remove('error');
        deleteMessage.classList.add('success');
        document.getElementById('delete-guest-id').value = '';
        updateListSummary(); // Atualiza a contagem da lista
    } else {
        // Nenhum convidado encontrado
        deleteMessage.textContent = `❌ Erro: Nenhum convidado encontrado com ID ou Nome "${query}".`;
        deleteMessage.classList.add('error');
        deleteMessage.classList.remove('success');
    }
}
window.deleteGuest = deleteGuest;


// Inicializa a aplicação
async function init() {
    await loadGuestList();
    startScanner();
}

init();