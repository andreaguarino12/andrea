// script.js - interazioni principali sito

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    initLoader();
    initParticles(isMobile);
    initMouseLight(isMobile, isTouchDevice);
    initScrollIndicator(isMobile, isTouchDevice);
    initCard3D(isMobile, isTouchDevice);
    initLazyBackgrounds();
    initRevealObserver();
    initScrollSpy();
    initMagneticButtons(isMobile, isTouchDevice);
    initProgressBars();
    initStatsCounter();
    initHomeRotationDots();
    initProjectPageEnhancements(isMobile, isTouchDevice);
    initScrollProgress();
    initLiveStatusTicker();
    initHeroParallax(isMobile, isTouchDevice);
    initClickRipples();

    const sphereCanvas = document.getElementById('sphereCanvas');
    if (sphereCanvas) initSphere(sphereCanvas);
});

function initLoader() {
    const pageLoader = document.querySelector('.page-loader-modern');
    if (!pageLoader) return;
    if (!sessionStorage.getItem('loaderShown')) {
        setTimeout(() => {
            pageLoader.classList.add('loaded');
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 600);
            sessionStorage.setItem('loaderShown', 'true');
        }, 1200);
    } else {
        pageLoader.style.display = 'none';
    }
}

function initParticles(isMobile) {
    if (typeof particlesJS === 'undefined') return;
    particlesJS('particles-js', {
        particles: {
            number: { value: isMobile ? 24 : 70, density: { enable: true, value_area: 800 } },
            color: { value: '#6366f1' },
            shape: { type: 'circle' },
            opacity: { value: 0.35, random: true },
            size: { value: isMobile ? 2 : 3, random: true },
            line_linked: { enable: !isMobile, distance: 150, color: '#6366f1', opacity: 0.2, width: 1 },
            move: { enable: true, speed: isMobile ? 0.8 : 1.8, random: true, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: !isMobile, mode: 'repulse' }, onclick: { enable: !isMobile, mode: 'push' }, resize: true }
        },
        retina_detect: true
    });
}

function initMouseLight(isMobile, isTouchDevice) {
    const mouseLight = document.querySelector('.mouse-light');
    if (!mouseLight) return;
    if (isMobile || isTouchDevice) {
        mouseLight.style.display = 'none';
        return;
    }
    document.addEventListener('mousemove', (e) => {
        mouseLight.style.left = `${e.clientX}px`;
        mouseLight.style.top = `${e.clientY}px`;
        mouseLight.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { mouseLight.style.opacity = '0'; });
}

function initScrollIndicator(isMobile, isTouchDevice) {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero-full');
    if (!scrollIndicator) return;
    if (isMobile || isTouchDevice || !heroSection) {
        scrollIndicator.style.display = 'none';
        return;
    }
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        scrollIndicator.style.opacity = heroBottom <= 0 ? '0' : '1';
    }, { passive: true });
}

function initCard3D(isMobile, isTouchDevice) {
    if (isMobile || isTouchDevice) return;
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 24;
            const rotateY = (rect.width / 2 - x) / 24;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

function initLazyBackgrounds() {
    const lazyNodes = document.querySelectorAll('.lazy-bg[data-bg]');
    if (!lazyNodes.length) return;

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const src = el.getAttribute('data-bg');
            if (src) {
                el.style.backgroundImage = `url('${src}')`;
                el.classList.remove('lazy-bg');
                el.removeAttribute('data-bg');
            }
            observer.unobserve(el);
        });
    }, { rootMargin: '120px 0px' });

    lazyNodes.forEach((node) => io.observe(node));
}

function initRevealObserver() {
    const revealItems = document.querySelectorAll('.fade-up');
    if (!revealItems.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealItems.forEach((item, idx) => {
        item.style.transitionDelay = `${Math.min(idx * 60, 240)}ms`;
        io.observe(item);
    });
}

function initScrollSpy() {
    const links = [...document.querySelectorAll('.top-nav .nav-link')];
    if (!links.length) return;
    const map = new Map();
    links.forEach((link) => {
        const id = link.getAttribute('href')?.replace('#', '');
        if (!id) return;
        const section = document.getElementById(id);
        if (section) map.set(section, link);
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((l) => l.classList.remove('active'));
            const link = map.get(entry.target);
            if (link) link.classList.add('active');
        });
    }, { threshold: 0.4 });

    map.forEach((_, section) => io.observe(section));
}

function initMagneticButtons(isMobile, isTouchDevice) {
    if (isMobile || isTouchDevice) return;
    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
    });
}

function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar-fill[data-percent]');
    const percents = document.querySelectorAll('.progress-percent[data-target]');
    if (!bars.length && !percents.length) return;

    const section = document.getElementById('competenze');
    if (!section) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            bars.forEach((bar) => {
                const target = Number(bar.getAttribute('data-percent')) || 0;
                bar.style.width = `${target}%`;
            });

            percents.forEach((el) => {
                const target = Number(el.getAttribute('data-target')) || 0;
                let current = 0;
                const timer = setInterval(() => {
                    current += Math.max(1, target / 30);
                    if (current >= target) {
                        el.textContent = `${target}%`;
                        clearInterval(timer);
                    } else {
                        el.textContent = `${Math.floor(current)}%`;
                    }
                }, 28);
            });

            io.unobserve(section);
        });
    }, { threshold: 0.35 });

    io.observe(section);
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const stat = entry.target;
            const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
            let current = 0;
            const increment = Math.max(1, target / 45);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = String(target);
                    clearInterval(timer);
                } else {
                    stat.textContent = String(Math.floor(current));
                }
            }, 20);
            io.unobserve(stat);
        });
    }, { threshold: 0.3 });

    statNumbers.forEach((stat) => io.observe(stat));
}

function initHomeRotationDots() {
    const rotationTrack = document.querySelector('.rotation-track');
    const dots = document.querySelectorAll('.dot');
    if (!rotationTrack || !dots.length) return;

    setInterval(() => {
        const transform = window.getComputedStyle(rotationTrack).transform;
        let index = 0;
        if (transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ');
                const translateX = parseFloat(values[4]) || 0;
                index = Math.round(Math.abs(translateX) / 120);
            }
        }
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }, 500);
}

function initProjectPageEnhancements(isMobile, isTouchDevice) {
    initProjectRotations();
    initProjectFilters();
    initCaseStudyModal();

    if (isMobile || isTouchDevice) return;
    const cards = document.querySelectorAll('.project-card-full');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 30;
            const rotateY = (rect.width / 2 - x) / 30;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

function initProjectRotations() {
    const projectRotations = document.querySelectorAll('.project-photo-rotation');
    projectRotations.forEach((rotation) => {
        const track = rotation.querySelector('.project-rotation-track');
        const dots = rotation.querySelectorAll('.project-dot');
        if (!track || !dots.length) return;
        setInterval(() => {
            const transform = window.getComputedStyle(track).transform;
            let index = 0;
            if (transform !== 'none') {
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ');
                    const translateX = parseFloat(values[4]) || 0;
                    const step = Math.max(track.clientWidth / 3, 1);
                    index = Math.round(Math.abs(translateX) / step);
                }
            }
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        }, 500);
    });
}

function initProjectFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.project-card-full[data-tags]');
    if (!chips.length || !cards.length) return;

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            const tag = chip.getAttribute('data-filter');

            cards.forEach((card) => {
                const tags = card.getAttribute('data-tags') || '';
                const show = tag === 'all' || tags.includes(tag);
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

function initCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    if (!modal) return;

    const titleEl = document.getElementById('case-study-title');
    const bodyEl = document.getElementById('case-study-body');

    document.querySelectorAll('.open-case-study').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.currentTarget.closest('.project-card-full');
            if (!card) return;
            const title = card.querySelector('.project-header h3')?.textContent?.trim() || 'Case study';
            const desc = card.querySelector('.project-description')?.textContent?.trim() || '';
            titleEl.textContent = title;
            bodyEl.textContent = `${desc} — Se vuoi posso condividere una demo tecnica, architettura e risultati misurabili in una call dedicata.`;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
        el.addEventListener('click', () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}


function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        bar.style.width = `${pct}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
}

function initLiveStatusTicker() {
    const text = document.getElementById('live-status-text');
    const deploy = document.getElementById('deploy-status');
    const labels = ['SYSTEM ONLINE', 'CI/CD ACTIVE', 'SECURE MODE', 'LATENCY LOW'];
    const deployLabels = ['running', 'stable', 'verified', 'completed'];
    if (text) {
        let i = 0;
        setInterval(() => {
            i = (i + 1) % labels.length;
            text.textContent = labels[i];
        }, 2200);
    }
    if (deploy) {
        let j = 0;
        setInterval(() => {
            j = (j + 1) % deployLabels.length;
            deploy.textContent = deployLabels[j];
        }, 1800);
    }
}

function initHeroParallax(isMobile, isTouchDevice) {
    if (isMobile || isTouchDevice) return;
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
}

function initClickRipples() {
    document.querySelectorAll('.nav-cta, .more-projects-btn, .filter-chip').forEach((el) => {
        el.addEventListener('click', (e) => {
            const r = document.createElement('span');
            r.className = 'click-ripple';
            const rect = el.getBoundingClientRect();
            r.style.left = `${e.clientX - rect.left}px`;
            r.style.top = `${e.clientY - rect.top}px`;
            el.appendChild(r);
            setTimeout(() => r.remove(), 500);
        });
    });
}

// Sfera 3D a punti con esplosione/ricomposizione automatica
function initSphere(canvas) {
    const ctx = canvas.getContext('2d');
    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const skills = [
        'Docker', 'K8s', 'n8n', 'Cloud', 'Linux', 'Python',
        'Bash', 'Git', 'AWS', 'OVH', 'Terraform', 'Ansible',
        'Prometheus', 'Grafana', 'Jenkins', 'GitHub Actions'
    ];

    const points = [];
    for (let i = 0; i < 80; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 100;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        points.push({ x, y, z, origX: x, origY: y, origZ: z, targetX: x, targetY: y, targetZ: z, skill: skills[i % skills.length], hue: (theta / (Math.PI * 2)) * 360 });
    }

    let rotationX = 0, rotationY = 0, targetRotationY = 0, autoRotate = true, explodeAnimation = false;

    const rotateButton = document.getElementById('rotate-sphere');
    const explodeButton = document.getElementById('explode-sphere');

    if (rotateButton) {
        rotateButton.addEventListener('click', () => {
            autoRotate = !autoRotate;
            rotateButton.innerHTML = autoRotate
                ? '<i class="fas fa-sync-alt"></i> Ruota Sfera'
                : '<i class="fas fa-pause"></i> Ferma Rotazione';
        });
    }

    if (explodeButton) {
        explodeButton.addEventListener('click', () => {
            if (explodeAnimation) return;
            explodeAnimation = true;
            points.forEach((p) => {
                p.targetX = p.origX + (Math.random() - 0.5) * 200;
                p.targetY = p.origY + (Math.random() - 0.5) * 200;
                p.targetZ = p.origZ + (Math.random() - 0.5) * 200;
            });
            const start = performance.now();
            const duration = 2000;
            const animate = () => {
                const progress = Math.min((performance.now() - start) / duration, 1);
                const t = progress < 0.5 ? (1 - Math.pow(1 - progress * 2, 2)) : Math.pow(2 - progress * 2, 2);
                points.forEach((p) => {
                    p.x = p.origX + (p.targetX - p.origX) * t;
                    p.y = p.origY + (p.targetY - p.origY) * t;
                    p.z = p.origZ + (p.targetZ - p.origZ) * t;
                });
                if (progress < 1) requestAnimationFrame(animate);
                else {
                    points.forEach((p) => { p.x = p.origX; p.y = p.origY; p.z = p.origZ; });
                    explodeAnimation = false;
                }
            };
            requestAnimationFrame(animate);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        if (autoRotate && !explodeAnimation) targetRotationY += 0.005;
        rotationY += (targetRotationY - rotationY) * 0.05;

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        [...points].sort((a, b) => b.z - a.z).forEach((p) => {
            const x1 = p.x * cosY - p.z * sinY;
            const z1 = p.x * sinY + p.z * cosY;
            const y1 = p.y;
            const scale = 300 / (300 + z1);
            const x2d = width / 2 + x1 * scale;
            const y2d = height / 2 - y1 * scale;
            const size = Math.max(2, 6 * scale);
            const brightness = 0.7 + 0.3 * (z1 / 150);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${p.hue}, 80%, ${60 * brightness}%)`;
            ctx.fill();

            if (scale > 0.72 && !explodeAnimation) {
                ctx.font = 'bold 10px "Inter", sans-serif';
                ctx.fillStyle = 'white';
                ctx.fillText(p.skill, x2d - 15, y2d - 10);
            }
        });

        requestAnimationFrame(draw);
    }

    draw();
}