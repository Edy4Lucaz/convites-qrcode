// app.js

const readerElementId = "reader";
const resultBox = document.getElementById("result-box");
const resultCasal = document.getElementById("result-casal"); 
const scanDetails = document.getElementById("scan-details");
const statusMessage = document.getElementById("status-message");
const resetButton = document.getElementById("reset-button");
const scanActions = document.getElementById("scan-actions");
const adminContent = document.getElementById('admin-content');
const newGuestIdDisplay = document.getElementById('new-guest-id');

let html5QrcodeScanner;
let listaConvidados = [];
let lastScannedId = null; 

const DB_KEY = 'convites_presenca';

// --- LISTA INICIAL DE CONVIDADOS EMBUTIDA NO CÓDIGO ---
const INITIAL_GUEST_DATA = [
    {"id":"G5P1","casal":"Casal Gabriel Mapombo","categoria":"A","limite":1,"scans":0},
    {"id":"F8C2","casal":"Casal Freitas Cavonguelua","categoria":"A","limite":1,"scans":0},
    {"id":"C3M7","casal":"Casal Cassule Mucuta","categoria":"A","limite":1,"scans":0},
    {"id":"P9A4","casal":"Casal Panzo","categoria":"A","limite":1,"scans":0},
    {"id":"I1G6","casal":"Casal Isaias Gaieta","categoria":"A","limite":1,"scans":0},
    {"id":"J2C5","casal":"Casal Júlio Lucamba","categoria":"A","limite":1,"scans":0},
    {"id":"T4J9","casal":"Casal Trindade Joaquim","categoria":"A","limite":1,"scans":0},
    {"id":"T1C5","casal":"Casal Tchimuefeleny","categoria":"A","limite":1,"scans":0},
    {"id":"B9T2","casal":"Casal Baptista Tchivela","categoria":"A","limite":1,"scans":0},
    {"id":"D5M3","casal":"Casal de Matos Miguel","categoria":"A","limite":1,"scans":0},
    {"id":"G6M8","casal":"Casal Gil Mahica","categoria":"A","limite":1,"scans":0},
    {"id":"V7I4","casal":"Casal Venâncio Isaias Bangi","categoria":"A","limite":1,"scans":0},
    {"id":"J3E1","casal":"Casal Juvenal Eduardo","categoria":"A","limite":1,"scans":0},
    {"id":"G2C4","casal":"Casal Geraldo Cassoco","categoria":"A","limite":1,"scans":0},
    {"id":"J6S9","casal":"Casal Jeremias Saluzendo","categoria":"A","limite":1,"scans":0},
    {"id":"P1C8","casal":"Paulo Cuvalela","categoria":"C","limite":2,"scans":0},
    {"id":"B4S7","casal":"Casal Bernardo Sapigâla","categoria":"A","limite":1,"scans":0},
    {"id":"A9G1","casal":"Casal Arão Germano","categoria":"A","limite":1,"scans":0},
    {"id":"S6I3","casal":"Casal Simba","categoria":"A","limite":1,"scans":0},
    {"id":"T7C1","casal":"Casal Tito Cayombo","categoria":"A","limite":1,"scans":0},
    {"id":"O5E2","casal":"Casal Olívio Ernesto","categoria":"A","limite":1,"scans":0},
    {"id":"L3C4","casal":"Casal Lili Cayombo","categoria":"A","limite":1,"scans":0},
    {"id":"F1M9","casal":"Casal Fernando Mupila","categoria":"A","limite":1,"scans":0},
    {"id":"M2G6","casal":"Casal Mateus Guimarães","categoria":"A","limite":1,"scans":0},
    {"id":"E4S5","casal":"Casal Estevão Sangueve","categoria":"A","limite":1,"scans":0},
    {"id":"B5F7","casal":"Benita e Fate","categoria":"C","limite":2,"scans":0},
    {"id":"A8L2","casal":"Áureo e Lavínia","categoria":"C","limite":2,"scans":0},
    {"id":"A3C9","casal":"Casal Amado Cayombo","categoria":"A","limite":1,"scans":0},
    {"id":"M7C2","casal":"Casal Mauro Cayombo","categoria":"A","limite":1,"scans":0},
    {"id":"C1M6","casal":"Casal Camilo","categoria":"A","limite":1,"scans":0},
    {"id":"Q9C3","casal":"Casal Quintino Camisa","categoria":"A","limite":1,"scans":0},
    {"id":"V6C4","casal":"Casal Valter Camisa","categoria":"A","limite":1,"scans":0},
    {"id":"B2P8","casal":"Casal Bruno Paiva","categoria":"A","limite":1,"scans":0},
    {"id":"P5B6","casal":"Casal Pedro Boma","categoria":"A","limite":1,"scans":0},
    {"id":"S4R1","casal":"Casal Salmo Rocha","categoria":"A","limite":1,"scans":0},
    {"id":"G1L9","casal":"Casal Gelson Lourenço","categoria":"A","limite":1,"scans":0},
    {"id":"O3A7","casal":"Casal Oldovano Agostinho","categoria":"A","limite":1,"scans":0},
    {"id":"E2A5","casal":"Casal Emílio Aspirante","categoria":"A","limite":1,"scans":0},
    {"id":"L5W1","casal":"Mãe Lourdes e Wilma","categoria":"C","limite":2,"scans":0},
    {"id":"M6N2","casal":"Mãe Minga e Noé","categoria":"C","limite":2,"scans":0},
    {"id":"A4E3","casal":"Aída e Elisa","categoria":"C","limite":2,"scans":0},
    {"id":"A1A9","casal":"Casal Aderito Abraão","categoria":"A","limite":1,"scans":0},
    {"id":"F6W3","casal":"Filomena e Walter","categoria":"C","limite":2,"scans":0},
    {"id":"J5R1","casal":"Casal Josué","categoria":"A","limite":1,"scans":0},
    {"id":"A7P4","casal":"Casal Alberto Pascoal","categoria":"A","limite":1,"scans":0},
    {"id":"M9C5","casal":"Casal Matías","categoria":"A","limite":1,"scans":0},
    {"id":"U1C8","casal":"Casal Ucuamba","categoria":"A","limite":1,"scans":0},
    {"id":"B3C7","casal":"Casal Benvindo Chilunda","categoria":"A","limite":1,"scans":0},
    {"id":"A6V2","casal":"Casal André Vasco","categoria":"A","limite":1,"scans":0},
    {"id":"D9F1","casal":"Domingas e Felícia","categoria":"C","limite":2,"scans":0},
    {"id":"F4G9","casal":"Casal Frederico","categoria":"A","limite":1,"scans":0},
    {"id":"E3T9","casal":"Casal Ernesto Trindade","categoria":"A","limite":1,"scans":0},
    {"id":"C2G8","casal":"Casal Carruagem","categoria":"A","limite":1,"scans":0},
    {"id":"J7V5","casal":"Casal José Tchivela","categoria":"A","limite":1,"scans":0},
    {"id":"A8O2","casal":"Casal Augusto Coríntio","categoria":"A","limite":1,"scans":0},
    {"id":"A4M6","casal":"Casal Alberto Tchombossi","categoria":"A","limite":1,"scans":0},
    {"id":"J1I3","casal":"Casal Jaime","categoria":"A","limite":1,"scans":0},
    {"id":"E9Y7","casal":"Evandra e Deisy","categoria":"C","limite":2,"scans":0},
    {"id":"B2U4","casal":"Casal Bandua","categoria":"A","limite":1,"scans":0},
    {"id":"A6N8","casal":"Casal Amândio Bonefácio","categoria":"A","limite":1,"scans":0},
    {"id":"F4S2","casal":"Casal Fábio Kassela","categoria":"A","limite":1,"scans":0},
    {"id":"J5K1","casal":"Jorgina Ekuva","categoria":"C","limite":1,"scans":0},
    {"id":"I7A3","casal":"Casal Isaac","categoria":"A","limite":1,"scans":0},
    {"id":"T9E5","casal":"Casal Tchivela","categoria":"A","limite":1,"scans":0},
    {"id":"F1D7","casal":"Casal Frederico","categoria":"A","limite":1,"scans":0},
    {"id":"J2O4","casal":"Jorge e Romeu","categoria":"C","limite":2,"scans":0},
    {"id":"E8X6","casal":"Edilson e Marques","categoria":"C","limite":2,"scans":0},
    {"id":"C3P9","casal":"Cecília e Melícia","categoria":"C","limite":2,"scans":0},
    {"id":"A7D1","casal":"Casal Abílio Dondo","categoria":"A","limite":1,"scans":0},
    {"id":"S4I8","casal":"Casal Salito","categoria":"A","limite":1,"scans":0},
    {"id":"L6U2","casal":"Casal Laurindo","categoria":"A","limite":1,"scans":0},
    {"id":"A1S3","casal":"Alfredo da Costa Gaieta","categoria":"C","limite":1,"scans":0},
    {"id":"C5H7","casal":"Casal Carruagem (Filhos)","categoria":"A","limite":1,"scans":0},
    {"id":"L8P4","casal":"Casal Luís Gaspar","categoria":"A","limite":1,"scans":0},
    {"id":"C9D5","casal":"Casal Constantino Dumbo","categoria":"A","limite":1,"scans":0},
    {"id":"J8N1","casal":"Justino","categoria":"C","limite":2,"scans":0},
    {"id":"M2G9","casal":"Mário e Glória","categoria":"C","limite":2,"scans":0},
    {"id":"U5A7","casal":"Casal Usana","categoria":"A","limite":1,"scans":0},
    {"id":"D3C4","casal":"Delfina Cavonguelua","categoria":"C","limite":2,"scans":0},
    {"id":"R7O2","casal":"Casal Rocha","categoria":"A","limite":1,"scans":0}
    
];


/* --- LÓGICA DE BD E CARREGAMENTO --- */

async function loadGuestList() {
    try {
        const savedList = localStorage.getItem(DB_KEY);
        if (savedList) {
            // Se houver dados salvos (de uma sessão anterior), use-os.
            listaConvidados = JSON.parse(savedList);
            statusMessage.textContent = `Lista carregada do cache (${listaConvidados.length} entradas).`;
        } else {
            // Se for a primeira vez, inicialize com a lista embutida e salve.
            listaConvidados = INITIAL_GUEST_DATA;
            localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
            statusMessage.textContent = `Lista inicial (${listaConvidados.length} entradas) carregada e salva.`;
        }
    } catch (error) {
        statusMessage.textContent = `ERRO CRÍTICO ao carregar lista.`;
        console.error("Erro ao carregar lista:", error);
    }
}

/* --- FUNÇÕES DE NAVEGAÇÃO, LEITURA, ADMIN, etc. (código restante...) --- */

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

function onScanSuccess(decodedText, decodedResult) {
    html5QrcodeScanner.pause(); 
    resultBox.classList.remove('success', 'error', 'pending');
    resultCasal.textContent = 'A processar...';
    scanDetails.textContent = '';
    scanActions.style.display = 'block';
    
    const guestId = decodedText.trim();
    const convidado = listaConvidados.find(c => c.id === guestId);

    if (convidado) {
        if (convidado.scans < convidado.limite) {
            convidado.scans += 1;
            lastScannedId = convidado.id; 
            localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados)); 

            const usosRestantes = convidado.limite - convidado.scans;
            
            resultBox.classList.add('success');
            resultCasal.textContent = `✅ ENTRADA REGISTRADA: ${convidado.casal}`;
            scanDetails.innerHTML = `Usos: ${convidado.scans}/${convidado.limite}. Restantes: <strong>${usosRestantes}</strong>`;
            
        } else {
            lastScannedId = null; 
            resultBox.classList.add('error');
            resultCasal.textContent = `🚫 ERRO: ${convidado.casal} atingiu o limite de ${convidado.limite} usos.`;
            scanDetails.textContent = 'ACESSO NEGADO.';
        }
    } else {
        lastScannedId = null;
        resultBox.classList.add('error');
        resultCasal.textContent = 'ERRO: Convite não encontrado.';
        scanDetails.textContent = 'ACESSO NEGADO. Código inválido.';
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
        if (html5QrcodeScanner) {
            html5QrcodeScanner.resume();
        }
        resultBox.classList.remove('success', 'error');
        resultBox.classList.add('pending');
        resultCasal.textContent = 'Aguardando leitura...';
        scanDetails.textContent = '';
        scanActions.style.display = 'none';
        lastScannedId = null;
    });
}

function undoLastScan() {
    if (!lastScannedId) {
        alert("Não há nenhuma leitura recente para desmarcar.");
        return;
    }
    
    const index = listaConvidados.findIndex(c => c.id === lastScannedId);
    
    if (index !== -1 && listaConvidados[index].scans > 0) {
        
        const nomeConvidado = listaConvidados[index].casal;
        
        listaConvidados[index].scans -= 1;
        localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
        
        resultBox.classList.remove('success', 'error', 'pending');
        resultBox.classList.add('pending');
        resultCasal.textContent = `🔁 USO DESMARCADO: ${nomeConvidado}`;
        scanDetails.textContent = `ID ${lastScannedId} teve o uso removido.`;
        
        lastScannedId = null; 
        
        if (html5QrcodeScanner) {
            html5QrcodeScanner.resume();
        }
        scanActions.style.display = 'none';
        
    } else {
        alert("Erro ao desmarcar o uso. O contador já está em zero.");
    }
}
window.undoLastScan = undoLastScan;

function updateListSummary() {
    const totalUsos = listaConvidados.reduce((acc, c) => acc + c.limite, 0);
    const usosOcupados = listaConvidados.reduce((acc, c) => acc + c.scans, 0);
    const usosDisponiveis = totalUsos - usosOcupados;
    
    document.getElementById('count-presentes').textContent = usosOcupados;
    document.getElementById('count-faltando').textContent = usosDisponiveis;
    document.getElementById('count-total').textContent = totalUsos;
}

function displayGuestList(status) {
    const listOutput = document.getElementById('guest-list-output'); 
    listOutput.innerHTML = '';
    
    let filteredList;
    if (status === 'presentes') {
        filteredList = listaConvidados.filter(c => c.scans >= c.limite); 
    } else if (status === 'faltando') {
        filteredList = listaConvidados.filter(c => c.scans < c.limite); 
    } else { 
        filteredList = listaConvidados; 
    }
        
    filteredList.sort((a, b) => a.casal.localeCompare(b.casal));
    
    if (filteredList.length === 0) {
        listOutput.innerHTML = `<p>Não há convidados nesta categoria.</p>`;
        return;
    }

    let tableHTML = `
        <h3>Lista de Convidados (${filteredList.length} entradas)</h3>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Usos (O/L)</th>
                    <th>Status</th>
                    <th>ID</th>
                </tr>
            </thead>
            <tbody>`;
    
    filteredList.forEach(convidado => {
        const isExhausted = convidado.scans >= convidado.limite;
        const statusText = isExhausted ? 'ESGOTADO' : `LIVRE (${convidado.limite - convidado.scans})`;
        const statusClass = isExhausted ? 'ausente' : 'presente';
        const tipo = convidado.limite === 1 ? 'CASAL (1x)' : 'PAR/IND. (2x)';
        
        tableHTML += `
            <tr class="${statusClass}">
                <td>${convidado.casal}</td>
                <td>${tipo}</td>
                <td>${convidado.scans} / ${convidado.limite}</td>
                <td>${statusText}</td>
                <td>${convidado.id}</td>
            </tr>`;
    });
    
    tableHTML += `</tbody></table>`;
    listOutput.innerHTML = tableHTML;
}
window.displayGuestList = displayGuestList;

function handleLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    if (user === 'admin' && pass === '1234') {
        document.getElementById('login-form').style.display = 'none';
        adminContent.style.display = 'block';
        document.getElementById('login-message').textContent = 'Login bem-sucedido!';
        document.getElementById('login-message').classList.remove('error');
        document.getElementById('login-message').classList.add('success');
    } else {
        document.getElementById('login-message').textContent = 'Usuário ou senha incorretos.';
        document.getElementById('login-message').classList.remove('success');
        document.getElementById('login-message').classList.add('error');
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

function addGuestSimple() {
    const casalInput = document.getElementById('new-casal');
    const categorySelect = document.getElementById('new-casal-category'); 
    const addMessage = document.getElementById('admin-add-message');
    
    const novoCasal = casalInput.value.trim();
    const categoria = categorySelect.value;
    
    if (!novoCasal) {
        addMessage.textContent = 'Por favor, preencha o nome do convidado.';
        addMessage.classList.remove('success');
        addMessage.classList.add('error');
        return;
    }
    
    const newId = generateUniqueId();
    const limite = categoria === 'A' ? 1 : 2; 

    const newGuest = {
        "id": newId,
        "casal": novoCasal,
        "categoria": categoria,
        "limite": limite,
        "scans": 0
    };

    listaConvidados.push(newGuest);
    localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
    
    addMessage.textContent = `Convidado "${novoCasal}" adicionado com sucesso!`;
    addMessage.classList.remove('error');
    addMessage.classList.add('success');
    
    newGuestIdDisplay.innerHTML = `
        <strong>ID gerado:</strong> 
        <span style="font-size: 1.2em; color: var(--primary-color);">${newId}</span>
        <p style="font-weight: normal; font-size: 0.9em; margin-top: 10px;">
            * Use este ID para gerar o QR Code. Limite de usos: ${limite}.
        </p>
    `;

    casalInput.value = '';
}
window.addGuestSimple = addGuestSimple;

function deleteGuest() {
    const query = document.getElementById('delete-guest-id').value.trim();
    const deleteMessage = document.getElementById('delete-message');

    if (!query) {
        deleteMessage.textContent = 'Por favor, insira o ID ou o Nome do convidado para remover.';
        deleteMessage.classList.add('error');
        deleteMessage.classList.remove('success');
        return;
    }

    const initialLength = listaConvidados.length;
    const normalizedQuery = query.toUpperCase();

    listaConvidados = listaConvidados.filter(c => {
        const idMatch = c.id.toUpperCase() === normalizedQuery;
        const casalMatch = c.casal.toUpperCase() === normalizedQuery;
        return !(idMatch || casalMatch); 
    });

    const guestsRemovedCount = initialLength - listaConvidados.length;

    if (guestsRemovedCount > 0) {
        localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
        deleteMessage.textContent = `✅ ${guestsRemovedCount} convidado(s) removido(s) com sucesso.`;
        deleteMessage.classList.remove('error');
        deleteMessage.classList.add('success');
        document.getElementById('delete-guest-id').value = '';
        updateListSummary(); 
    } else {
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
