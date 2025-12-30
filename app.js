// app.js corrigido por Gemini

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

// Mudei a versão para V3 para forçar o navegador a atualizar a lista
const DB_KEY = 'convites_presenca_v3';

// --- LISTA COMPLETA ATUALIZADA (80 CONVIDADOS) ---
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
    {"id":"P1C8","casal":"Paulo Cuvalela","categoria":"C","limite":1,"scans":0},
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
    {"id":"J8N1","casal":"Justino","categoria":"C","limite":1,"scans":0},
    {"id":"M2G9","casal":"Mário e Glória","categoria":"C","limite":2,"scans":0},
    {"id":"U5A7","casal":"Casal Usana","categoria":"A","limite":1,"scans":0},
    {"id":"D3C4","casal":"Delfina Cavonguelua","categoria":"C","limite":1,"scans":0},
    {"id":"R7O2","casal":"Casal Rocha","categoria":"A","limite":1,"scans":0}
];

/* --- LÓGICA DE BD E CARREGAMENTO --- */

async function loadGuestList() {
    try {
        const savedList = localStorage.getItem(DB_KEY);
        if (savedList) {
            listaConvidados = JSON.parse(savedList);
            statusMessage.textContent = `Lista carregada (${listaConvidados.length} convidados).`;
        } else {
            // Se não houver a chave V3, ele carrega os novos nomes aqui
            listaConvidados = INITIAL_GUEST_DATA;
            localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados));
            statusMessage.textContent = `Lista sincronizada (${listaConvidados.length} convidados).`;
        }
    } catch (error) {
        statusMessage.textContent = `ERRO ao carregar lista.`;
        console.error(error);
    }
}

/* --- FUNÇÕES DE INTERFACE --- */

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}
window.toggleSidebar = toggleSidebar;

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
    
    if (sectionId === 'list-section') {
        updateListSummary();
        displayGuestList('faltando'); 
    }
}
window.showSection = showSection;

/* --- LÓGICA DE SCANNER --- */

function onScanSuccess(decodedText) {
    html5QrcodeScanner.pause(); 
    const guestId = decodedText.trim();
    const convidado = listaConvidados.find(c => c.id === guestId);

    resultBox.classList.remove('success', 'error', 'pending');
    scanActions.style.display = 'block';

    if (convidado) {
        if (convidado.scans < convidado.limite) {
            convidado.scans += 1;
            lastScannedId = convidado.id; 
            localStorage.setItem(DB_KEY, JSON.stringify(listaConvidados)); 

            resultBox.classList.add('success');
            resultCasal.textContent = `✅ ENTRADA: ${convidado.casal}`;
            scanDetails.innerHTML = `Usos: ${convidado.scans}/${convidado.limite}`;
        } else {
            resultBox.classList.add('error');
            resultCasal.textContent = `🚫 LIMITE ATINGIDO: ${convidado.casal}`;
            scanDetails.textContent = 'Acesso Negado.';
        }
    } else {
        resultBox.classList.add('error');
        resultCasal.textContent = '❌ Convite não encontrado.';
    }
}

function startScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(readerElementId, { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);

    resetButton.addEventListener('click', () => {
        html5QrcodeScanner.resume();
        resultBox.classList.add('pending');
        resultCasal.textContent = 'Aguardando leitura...';
        scanActions.style.display = 'none';
    });
}

/* --- GESTÃO DE LISTA --- */

function displayGuestList(status) {
    const listOutput = document.getElementById('guest-list-output'); 
    let filtered = listaConvidados;
    
    if (status === 'presentes') filtered = listaConvidados.filter(c => c.scans >= c.limite);
    if (status === 'faltando') filtered = listaConvidados.filter(c => c.scans < c.limite);

    filtered.sort((a, b) => a.casal.localeCompare(b.casal));

    let html = `<table><thead><tr><th>Nome</th><th>Status</th><th>ID</th></tr></thead><tbody>`;
    filtered.forEach(c => {
        html += `<tr><td>${c.casal}</td><td>${c.scans}/${c.limite}</td><td>${c.id}</td></tr>`;
    });
    html += `</tbody></table>`;
    listOutput.innerHTML = html;
}
window.displayGuestList = displayGuestList;

function updateListSummary() {
    const ocupados = listaConvidados.reduce((acc, c) => acc + c.scans, 0);
    document.getElementById('count-presentes').textContent = ocupados;
    document.getElementById('count-total').textContent = listaConvidados.length;
}

// Inicialização
async function init() {
    await loadGuestList();
    startScanner();
}
init();
