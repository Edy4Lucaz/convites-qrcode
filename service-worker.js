const CACHE_NAME = 'convites-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'app.js',
    'style.css',
    'manifest.json',
    'https://unpkg.com/html5-qrcode' // Biblioteca externa
    // Adicione os caminhos dos seus ícones aqui:
    // 'icon-192.png', 
    // 'icon-512.png'
];

// Instalação: Armazena todos os arquivos em cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Busca: Serve arquivos do cache (offline-first)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o cache se encontrado
                if (response) {
                    return response;
                }
                // Faz a requisição à rede se não estiver no cache
                return fetch(event.request);
            })
    );
});

// Ativação: Limpa caches antigos (opcional, mas recomendado para atualizações)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});