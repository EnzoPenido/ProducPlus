function getAPIUrl() {
    // Em desenvolvimento local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }

    // Em produção ou rede local, usa o mesmo protocolo e host, mas porta 3000
    const protocol = window.location.protocol; // http: ou https:
    const hostname = window.location.hostname; // IP ou domínio

    return `${protocol}//${hostname}:3000`;
}

// Exporta a URL da API como constante global
window.API_CONFIG = {
    BASE_URL: getAPIUrl(),
    TIMEOUT: 30000,

    url(endpoint) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.BASE_URL}${cleanEndpoint}`;
    },

    async fetch(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        try {
            const response = await fetch(this.url(endpoint), {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Requisição excedeu o tempo limite');
            }
            throw error;
        }
    }
};

window.API_URL = window.API_CONFIG.BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 API Configuration:', {
        baseUrl: window.API_CONFIG.BASE_URL,
        environment: 'development'
    });
} else {
    console.log('🚀 API Configuration:', {
        baseUrl: window.API_CONFIG.BASE_URL,
        environment: 'production'
    });
}