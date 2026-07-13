(function() {
    'use strict';

    // --- OCULTAR EFECTO DE CARGA ---
    const loadingEffect = document.getElementById('loading-effect');
    window.addEventListener('load', function() {
        loadingEffect.classList.add('hidden');
        setTimeout(() => {
            loadingEffect.style.display = 'none';
        }, 800);
    });

    // --- ELEMENTOS ---
    const sobre = document.getElementById('sobre-invitacion');
    const mainContent = document.getElementById('main-content');
    const btnIngresar = document.getElementById('btn-ingresar');
    const audio = document.getElementById('bg-music');
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    const musicIcon = btnMusicToggle.querySelector('i');

    // --- MÚSICA ---
    function toggleMusic() {
        if (audio.paused) {
            audio.play().catch(() => {});
            musicIcon.className = 'fas fa-pause';
        } else {
            audio.pause();
            musicIcon.className = 'fas fa-play';
        }
    }
    btnMusicToggle.addEventListener('click', toggleMusic);

    // --- INGRESAR CON EFECTO MEJORADO ---
    btnIngresar.addEventListener('click', function() {
        audio.play().catch(() => {});
        musicIcon.className = 'fas fa-pause';

        sobre.classList.add('oculto');
        setTimeout(() => {
            mainContent.classList.add('visible');
            setTimeout(() => {
                iniciarConfeti();
            }, 300);
        }, 400);

        setTimeout(() => {
            sobre.style.display = 'none';
        }, 1200);
    });

    // --- CONTADOR ---
    const fechaBoda = new Date('2026-08-08T17:00:00').getTime();
    function actualizarContador() {
        const ahora = Date.now();
        let diff = fechaBoda - ahora;
        if (diff < 0) diff = 0;
        document.getElementById('days').textContent = String(Math.floor(diff / (1000*60*60*24))).padStart(2, '0');
        document.getElementById('hours').textContent = String(Math.floor((diff % (1000*60*60*24)) / (1000*60*60))).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.floor((diff % (1000*60*60)) / (1000*60))).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.floor((diff % (1000*60)) / 1000)).padStart(2, '0');
    }
    actualizarContador();
    setInterval(actualizarContador, 1000);

    // --- MODALES ---
    const modales = document.querySelectorAll('.modal-overlay');
    const botonesAbrir = {
        'btn-mapa': 'modal-mapa',
        'btn-dresscode': 'modal-dresscode',
        'btn-tips': 'modal-tips',
        'btn-regalos': 'modal-regalos',
        'btn-qr': 'modal-qr',
        'btn-confirmar': 'modal-confirmar'
    };

    Object.keys(botonesAbrir).forEach(idBoton => {
        const btn = document.getElementById(idBoton);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = document.getElementById(botonesAbrir[idBoton]);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });

    document.querySelectorAll('.close-modal').forEach(el => {
        el.addEventListener('click', function() {
            const modal = document.getElementById(this.dataset.modal);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    modales.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- BOTÓN SUBIR FOTOS ---
    document.getElementById('btn-subir-fotos').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://drive.google.com/drive/folders/ejemplo', '_blank');
    });

    // --- CONFETI ---
    let confetiActivo = false;
    let confetiAnimId = null;
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h - h;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.color = `hsl(${Math.random() * 60 + 330}, 80%, 60%)`;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 6;
            this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
            this.rotation += this.rotSpeed;
            if (this.y > h + 20) {
                this.y = -20;
                this.x = Math.random() * w;
                this.speedY = Math.random() * 4 + 2;
                this.color = `hsl(${Math.random() * 60 + 330}, 80%, 60%)`;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 4;
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            }
            ctx.restore();
        }
    }

    function iniciarConfeti() {
        if (confetiActivo) return;
        confetiActivo = true;
        for (let i = 0; i < 150; i++) {
            const p = new Particle();
            p.y = Math.random() * h;
            particles.push(p);
        }
        function animar() {
            if (!confetiActivo) return;
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            confetiAnimId = requestAnimationFrame(animar);
        }
        animar();
        setTimeout(() => {
            confetiActivo = false;
            if (confetiAnimId) cancelAnimationFrame(confetiAnimId);
            ctx.clearRect(0, 0, w, h);
            particles = [];
        }, 8000);
    }

    // ===== LIGHTBOX CON NAVEGACIÓN =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let lightboxImages = [];
    let currentIndex = 0;

    function abrirLightbox(images, index) {
        lightboxImages = images;
        currentIndex = index;
        mostrarImagen();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (lightboxImages.length > 1) {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        } else {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        }
    }

    function mostrarImagen() {
        const imgData = lightboxImages[currentIndex];
        lightboxImg.src = imgData.src;
        lightboxTitle.textContent = imgData.title;
    }

    function cambiarImagen(delta) {
        currentIndex = (currentIndex + delta + lightboxImages.length) % lightboxImages.length;
        mostrarImagen();
    }

    document.querySelectorAll('.foto-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const src = this.dataset.lightbox;
            const title = this.dataset.title || 'Recuerdo especial';
            abrirLightbox([{ src, title }], 0);
        });
    });

    document.querySelectorAll('.carrusel-item').forEach(item => {
        item.addEventListener('click', function() {
            const items = document.querySelectorAll('.carrusel-item');
            const images = Array.from(items).map(el => ({
                src: el.dataset.src,
                title: el.dataset.title || 'Recuerdo'
            }));
            const index = Array.from(items).indexOf(this);
            abrirLightbox(images, index);
        });
    });

    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        if (lightboxImages.length > 1) cambiarImagen(-1);
    });
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        if (lightboxImages.length > 1) cambiarImagen(1);
    });

    function cerrarLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImages = [];
    }

    lightboxClose.addEventListener('click', cerrarLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) cerrarLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            cerrarLightbox();
        }
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            if (lightboxImages.length > 1) cambiarImagen(-1);
        }
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            if (lightboxImages.length > 1) cambiarImagen(1);
        }
    });

    console.log('Invitación de boda cargada. ¡Felicidades Yelsin & Rouz!');
})();