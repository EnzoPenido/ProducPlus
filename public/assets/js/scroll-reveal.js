// Efeito de fade in ao rolar a página

document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Intersection Observer
    const observerOptions = {
        threshold: 0.15, // Elemento aparece quando 15% está visível
        rootMargin: '0px 0px -50px 0px' // Margem para trigger
    };

    // Callback quando elemento entra no viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona classe de animação
                entry.target.classList.add('fade-in-visible');
                
                // Para de observar depois que já apareceu
                observer.unobserve(entry.target);
            }
        });
    };

    // Cria o observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Seleciona todos os elementos que devem ter o efeito
    const elementsToAnimate = document.querySelectorAll(
        '.informacoes, .informacoes2, .titulinho, .texto-info, .marka, .marquee'
    );

    // Adiciona classe inicial e observa cada elemento
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in-element');
        observer.observe(element);
    });

    // Para o hero section (primeira seção), fade in imediato
    const heroSection = document.querySelector('.hero-home');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('fade-in-visible');
        }, 200);
    }
});