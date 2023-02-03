// Instalando a Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker instalado com sucesso.");
});

// Ativando a Service Worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker ativado com sucesso.");
});

// Capturando requisições de rede
self.addEventListener("fetch", (event) => {
    console.log("Capturando requisição de rede.");
});
