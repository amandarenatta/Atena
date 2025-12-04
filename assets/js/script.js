document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // LÓGICA DO MENU MOBILE
    // ======================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    const submenuLinks = document.querySelectorAll('.has-submenu > a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (window.innerWidth <= 992) {
                event.preventDefault();
                const parentItem = this.parentElement;
                parentItem.closest('.menu').querySelectorAll('.open').forEach(openItem => {
                    if (openItem !== parentItem) { openItem.classList.remove('open'); }
                });
                parentItem.classList.toggle('open');
            }
        });
    });

    // ======================================================
    // LÓGICA DO HERO SLIDER MODERNO (HOMEPAGE)
    // ======================================================
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const prevButton = slider.querySelector('.prev-slide');
        const nextButton = slider.querySelector('.next-slide');
        const paginationContainer = slider.querySelector('.slider-pagination');
        let currentSlide = 0;
        let slideInterval;

        //  Cria os pontos de paginação (dots)
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide(); 
            });
            paginationContainer.appendChild(dot);
        });

        const dots = paginationContainer.querySelectorAll('.pagination-dot');

        //  Função principal para mostrar um slide
        const showSlide = (index) => {
            if (index >= slides.length) {
                index = 0;
            } else if (index < 0) {
                index = slides.length - 1;
            }

            // Atualiza o estado
            currentSlide = index;

            // Remove a classe 'active' de todos e adiciona ao slide atual
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');

            // Atualiza os pontos de paginação
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        const startAutoSlide = () => {
            slideInterval = setInterval(nextSlide, 7000); 
        };

        const resetAutoSlide = () => {
            clearInterval(slideInterval);
            startAutoSlide();
        };

        showSlide(0);
        startAutoSlide();
    }

    // ======================================================
    // LÓGICA DO HEADER DA HOMEPAGE (EFEITO DE SCROLL)
    // ======================================================
    if (document.body.classList.contains('homepage')) {
        const homeMainNav = document.querySelector('.home-main-nav');
        if (homeMainNav && window.innerWidth > 992) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    homeMainNav.classList.add('scrolled');
                } else {
                    homeMainNav.classList.remove('scrolled');
                }
            });
        }
    }

    // ======================================================
    // LÓGICA DE ANIMAÇÃO DE SCROLL (REPETITIVA)
    // ======================================================
    const createScrollObserver = (selector) => {
        const elements = document.querySelectorAll(selector); 
        if (!elements || elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            if(element) observer.observe(element);
        });
    };

    // Array com todos os seletores que devem ser animados
    const animatedSelectors = [
        '.welcome-section', '.history-section', '.pillar-card',
        '.parallax-cta-section', '.unit-card', '.volunteer-card',
        '.volunteer-cta', '.story-content-section', '.prayer-section',
        '.logo-item', '.info-card', '.intro-text', '.intro-image',
        '.atividades-section', '.atividade-item', '.final-cta-section',
        '.card-reveal-item', '.gallery-item', '.map-section',
        '.split-hero-section', '.media-hero-editorial',
        '.article-hero-section', '.article-card', 
        '.simple-slider-container', 
        '.category-main-grid' 
    ];
    animatedSelectors.forEach(selector => createScrollObserver(selector));

    
    // ======================================================
    // LÓGICA DE SCROLL SUAVE PARA ÂNCORAS
    // ======================================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const isSamePage = window.location.pathname === this.pathname || this.pathname === '';
            
            if (targetId && targetId.length > 1 && isSamePage) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

// ======================================================
    // LÓGICA PARA CARREGAR NOTÍCIAS (JSON)
    // ======================================================
    
    function createNewsCard(item, index = 0) {
        let cardClass = "news-card news-card-standard"; 
        let cardLink = item.link || "#"; 
        
        let mediaHtml = '';
        let titleHtml = '';
        let linkHtml = '';

        if (item.embedHtml && item.embedHtml !== "") {
            cardClass += " has-video"; 
            mediaHtml = `
                <div class="news-card-media news-card-video-wrapper">
                    ${item.embedHtml}
                </div>
            `;
            titleHtml = `<h4 class="news-card-title">${item.title}</h4>`;
            linkHtml = `<a href="${cardLink}" target="_blank" class="news-card-link">Ver Post →</a>`;

        } 
        else if (item.image && item.image !== "") {
            cardClass += " has-image"; 
            
            mediaHtml = `
                <div class="news-card-media news-card-image-wrapper">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            `;
            titleHtml = `
                <a href="${cardLink}" target="_blank" class="news-card-title-link">
                    <h4 class="news-card-title">${item.title}</h4>
                </a>
            `;
            linkHtml = `<a href="${cardLink}" target="_blank" class="news-card-link">Leia Mais →</a>`; 
        }
        else {
             mediaHtml = ''; 
             titleHtml = `<h4 class="news-card-title">${item.title}</h4>`;
             linkHtml = `<a href="${cardLink}" target="_blank" class="news-card-link">Leia Mais →</a>`;
        }

        let contentHtml = `
            <div class="news-card-content">
                <span class="news-card-category">${item.category}</span>
                ${titleHtml}
                <p class="news-card-snippet">${item.snippet}</p>
                ${linkHtml}
            </div>
        `;

        let styleDelay = `style="transition-delay: ${index * 0.05}s"`;

        return `
            <div class="${cardClass}" ${styleDelay}>
                ${mediaHtml}
                ${contentHtml}
            </div>
        `;
    }

    function loadNews(jsonPath) {
        const newsGridPreview = document.getElementById('news-grid-preview'); 
        const newsFeedContainer = document.getElementById('news-feed-container'); 

        fetch(jsonPath)
            .then(response => {
                if (!response.ok) { throw new Error(`Erro de Rede: ${response.status}`); }
                return response.json();
            })
            .then(data => {
                const sortedNews = data.sort((a, b) => new Date(b.date) - new Date(a.date));

                if (newsFeedContainer) {
                    const newsItems = sortedNews.slice(0, 10);
                    let allNewsHTML = '';

                    newsItems.forEach((item, index) => {
                        allNewsHTML += createNewsCard(item, index);
                    });

                    newsFeedContainer.innerHTML = allNewsHTML;
                    createScrollObserver('.news-card');
                }

                if (newsGridPreview) {
                    const previewNews = sortedNews.slice(0, 3);
                    let previewHTML = '';
                    previewNews.forEach((item, index) => {
                        previewHTML += createNewsCard(item, index); 
                    });
                    newsGridPreview.innerHTML = previewHTML;
                    createScrollObserver('.news-card'); 
                }
            })
            .catch(error => {
                console.error('Erro ao carregar as notícias:', error);
                const errorMsg = "<p>Não foi possível carregar as notícias no momento.</p>";
                if (newsFeedContainer) newsFeedContainer.innerHTML = errorMsg;
                if (newsGridPreview) newsGridPreview.innerHTML = errorMsg;
            });
    }

    loadNews('assets/css/data/noticias.json');

    // ======================================================
    // LÓGICA DO MODAL DE DOAÇÕES (PIX)
    // ======================================================
    const modalOverlay = document.getElementById('donation-modal');
    const openModalBtns = document.querySelectorAll('.header-cta-button, .btn-doar-agora'); 
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const copyPixBtn = document.getElementById('btn-copy-pix');
    const pixInput = document.getElementById('pix-key');

    // 1. Abrir Modal
    if (openModalBtns) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); 
                if (modalOverlay) modalOverlay.classList.add('active');
            });
        });
    }

    // 2. Fechar Modal
    function closeDonationModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDonationModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeDonationModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeDonationModal();
        }
    });

    // 3. Copiar Chave Pix
    if (copyPixBtn && pixInput) {
        copyPixBtn.addEventListener('click', function() {
            pixInput.select();
            pixInput.setSelectionRange(0, 99999); 

            navigator.clipboard.writeText(pixInput.value).then(() => {
                const originalText = copyPixBtn.innerHTML;
                copyPixBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copiado!';
                copyPixBtn.classList.add('copied');

                setTimeout(() => {
                    copyPixBtn.innerHTML = originalText;
                    copyPixBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
            });
        });
    }
    
    // ======================================================
    // LÓGICA DA GALERIA LIGHTBOX (ABRE FOTO GRANDE)
    // ======================================================
    function initializeLightbox() {
        const lightbox = document.getElementById('lightbox-modal');
        const imgElement = document.getElementById('lightbox-image');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const closeBtn = document.getElementById('lightbox-close');

        if (!lightbox) return;

        let currentImageIndex = 0;
        let currentImageGroup = [];

        const openLightbox = (startIndex, group) => {
            currentImageGroup = group;
            currentImageIndex = startIndex;
            updateLightboxContent();
            lightbox.classList.add('active');
        };

        const updateLightboxContent = () => {
            if (currentImageGroup.length === 0) return;
            const currentImgSrc = currentImageGroup[currentImageIndex];
            imgElement.src = currentImgSrc;

            if (currentImageGroup.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        };

        const goToNext = () => {
            currentImageIndex = (currentImageIndex + 1) % currentImageGroup.length;
            updateLightboxContent();
        };

        const goToPrev = () => {
            currentImageIndex = (currentImageIndex - 1 + currentImageGroup.length) % currentImageGroup.length;
            updateLightboxContent();
        };

        prevBtn.addEventListener('click', goToPrev);
        nextBtn.addEventListener('click', goToNext);
        closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrev();
            }
        });


        const clickableContainers = document.querySelectorAll('.gallery-item img, .gallery-grid img');
        
        clickableContainers.forEach(imgElement => {
            const parentContainer = imgElement.closest('.simple-slider-container, .gallery-grid');
            
            if (parentContainer) {
                const groupElements = parentContainer.querySelectorAll('img');
                const groupSrcs = Array.from(groupElements).map(el => el.src);

                imgElement.style.cursor = 'pointer'; 

                imgElement.addEventListener('click', () => {
                    const src = imgElement.src;
                    const startIndex = groupSrcs.indexOf(src);

                    openLightbox(startIndex, groupSrcs); 
                });
            }
        });
    }
    
    initializeLightbox();
    initializeSlider('ct-masculina-slider');
    initializeSlider('ct-feminina-slider');
    
    // ======================================================
    // LOGICA DO SLIDER (FUNÇÃO BÁSICA)
    // ======================================================
    function initializeSlider(containerId) {
        const slider = document.getElementById(containerId);
        if (!slider) return;

        const wrapper = slider.querySelector('.carousel-wrapper');
        const slides = slider.querySelectorAll('.gallery-item');
        const prevBtn = slider.querySelector('.prev-slide');
        const nextBtn = slider.querySelector('.next-slide');
        let currentIndex = 0;
        
        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1; 
            } else if (index >= slides.length) {
                index = 0; 
            }

            currentIndex = index;
            const offset = -currentIndex * 100; 
            wrapper.style.transform = `translateX(${offset}%)`;
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        createScrollObserver('.simple-slider-container');
    }

});