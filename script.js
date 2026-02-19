// script.js - con modern minimal loader

document.addEventListener('DOMContentLoaded', function() {
    // MODERN MINIMAL PAGE LOADER
    const pageLoader = document.querySelector('.page-loader-modern');
    if (pageLoader) {
        // Controlla se è la prima visita (sessionStorage)
        if (!sessionStorage.getItem('loaderShown')) {
            // Prima visita: mostra loader per 1.5 secondi poi rimuovi
            setTimeout(() => {
                pageLoader.classList.add('loaded');
                // Dopo la transazione, rimuovi dal DOM
                setTimeout(() => {
                    if (pageLoader.parentNode) {
                        pageLoader.style.display = 'none';
                    }
                }, 600);
                // Salva in sessionStorage che il loader è già stato mostrato
                sessionStorage.setItem('loaderShown', 'true');
            }, 1500);
        } else {
            // Visite successive: nascondi immediatamente
            pageLoader.style.display = 'none';
        }
    }

    // Rilevamento dispositivo mobile più preciso
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Inizializza particelle (meno intense su mobile)
    if (typeof particlesJS !== 'undefined') {
        const particleConfig = {
            particles: {
                number: { value: isMobile ? 30 : 80, density: { enable: true, value_area: 800 } },
                color: { value: "#6366f1" },
                shape: { type: "circle" },
                opacity: { value: 0.4, random: true },
                size: { value: isMobile ? 2 : 3, random: true },
                line_linked: {
                    enable: !isMobile,
                    distance: 150,
                    color: "#6366f1",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? 1 : 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: !isMobile, mode: "repulse" },
                    onclick: { enable: !isMobile, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        };
        
        particlesJS('particles-js', particleConfig);
    }

    // Effetto luce che segue il mouse (solo su desktop, non touch)
    const mouseLight = document.querySelector('.mouse-light');
    
    if (mouseLight && !isMobile && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseLight.style.left = e.clientX + 'px';
            mouseLight.style.top = e.clientY + 'px';
            mouseLight.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            mouseLight.style.opacity = '0';
        });
    } else if (mouseLight) {
        mouseLight.style.display = 'none';
    }

    // Gestione indicatore scroll - DISABILITATO SU MOBILE
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero-full');
    
    if (scrollIndicator && heroSection && !isMobile && !isTouchDevice) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            scrollIndicator.style.opacity = heroBottom <= 0 ? '0' : '1';
        });
    } else if (scrollIndicator) {
        // Assicurati che sia nascosto su mobile
        scrollIndicator.style.display = 'none';
    }

    // Effetto 3D per le card (solo su desktop)
    const cards = document.querySelectorAll('.card-3d');
    if (!isMobile && !isTouchDevice) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Placeholder link progetti
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => e.preventDefault());
    });

    // Contatti footer (con nuovi dati)
    const contactItems = document.querySelectorAll('.footer-contacts .contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            // Puoi aggiungere azioni specifiche qui se necessario
            console.log('Contatto cliccato:', item.innerText);
        });
    });

    // Inizializza sfera 3D
    const sphereCanvas = document.getElementById('sphereCanvas');
    if (sphereCanvas) {
        initSphere(sphereCanvas);
    }

    // Gestione rotazione foto - sincronizza i pallini (per home)
    const rotationTrack = document.querySelector('.rotation-track');
    const dots = document.querySelectorAll('.dot');
    
    if (rotationTrack && dots.length) {
        setInterval(() => {
            if (!rotationTrack) return;
            
            const transform = window.getComputedStyle(rotationTrack).transform;
            let index = 0;
            
            if (transform !== 'none') {
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ');
                    const translateX = parseFloat(values[4]) || 0;
                    index = Math.round(Math.abs(translateX) / 80);
                    
                    // Adatta per versione ingrandita
                    const parent = rotationTrack.closest('.photo-rotation');
                    if (parent && parent.classList.contains('enlarged')) {
                        index = Math.round(Math.abs(translateX) / 120);
                    }
                }
            }
            
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, 500);
    }

    // Animazione contatori per le statistiche (aggiornati)
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 20);
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Gestione resize per adattare effetti
    window.addEventListener('resize', function() {
        const width = window.innerWidth;
        const isNowMobile = width <= 768;
        
        if (isNowMobile && mouseLight) {
            mouseLight.style.display = 'none';
        } else if (!isNowMobile && mouseLight && !isTouchDevice) {
            mouseLight.style.display = 'block';
        }
        
        // Nascondi scroll indicator su mobile via resize
        if (scrollIndicator) {
            if (isNowMobile) {
                scrollIndicator.style.display = 'none';
            } else {
                scrollIndicator.style.display = 'flex';
            }
        }
    });
    
    // Nascondi immediatamente scroll indicator se siamo su mobile
    if (isMobile || isTouchDevice || window.innerWidth <= 768) {
        if (scrollIndicator) scrollIndicator.style.display = 'none';
        if (mouseLight) mouseLight.style.display = 'none';
    }
});

// Sfera 3D a punti con esplosione/ricomposizione automatica
function initSphere(canvas) {
    const ctx = canvas.getContext('2d');
    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    
    const skills = [
        "Docker", "K8s", "n8n", "Cloud", "Linux", "Python",
        "Bash", "Git", "AWS", "OVH", "Terraform", "Ansible",
        "Prometheus", "Grafana", "Jenkins", "GitHub Actions"
    ];
    
    const points = [];
    const numPoints = 80;
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 100;
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        const hue = (theta / (Math.PI * 2)) * 360;
        
        points.push({
            x, y, z,
            origX: x, origY: y, origZ: z,
            targetX: x, targetY: y, targetZ: z,
            theta, phi,
            skill: skills[i % skills.length],
            hue: hue
        });
    }
    
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let autoRotate = true;
    let explodeAnimation = false;
    
    function autoRotateFunc() {
        if (autoRotate && !explodeAnimation) {
            targetRotationY += 0.005;
        }
    }
    
    document.getElementById('rotate-sphere').addEventListener('click', () => {
        autoRotate = !autoRotate;
        const btn = document.getElementById('rotate-sphere');
        btn.innerHTML = autoRotate ? 
            '<i class="fas fa-sync-alt"></i> Ruota Sfera' : 
            '<i class="fas fa-pause"></i> Ferma Rotazione';
    });
    
    document.getElementById('explode-sphere').addEventListener('click', () => {
        if (explodeAnimation) return;
        
        explodeAnimation = true;
        
        points.forEach(p => {
            p.targetX = p.origX + (Math.random() - 0.5) * 200;
            p.targetY = p.origY + (Math.random() - 0.5) * 200;
            p.targetZ = p.origZ + (Math.random() - 0.5) * 200;
        });
        
        const startTime = performance.now();
        const explodeDuration = 2000;
        
        function animateExplode() {
            const now = performance.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / explodeDuration, 1);
            
            let t;
            if (progress < 0.5) {
                t = progress * 2;
                t = 1 - Math.pow(1 - t, 2);
            } else {
                t = 2 - progress * 2;
                t = Math.pow(t, 2);
            }
            
            points.forEach(p => {
                p.x = p.origX + (p.targetX - p.origX) * t;
                p.y = p.origY + (p.targetY - p.origY) * t;
                p.z = p.origZ + (p.targetZ - p.origZ) * t;
            });
            
            if (progress < 1) {
                requestAnimationFrame(animateExplode);
            } else {
                points.forEach(p => {
                    p.x = p.origX;
                    p.y = p.origY;
                    p.z = p.origZ;
                });
                explodeAnimation = false;
            }
        }
        
        requestAnimationFrame(animateExplode);
    });
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        if (!explodeAnimation) autoRotateFunc();
        
        rotationX += (targetRotationX - rotationX) * 0.05;
        rotationY += (targetRotationY - rotationY) * 0.05;
        
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        
        const sortedPoints = [...points].sort((a, b) => {
            const az = a.z * cosX * cosY - a.x * sinY;
            const bz = b.z * cosX * cosY - b.x * sinY;
            return bz - az;
        });
        
        sortedPoints.forEach(p => {
            let x1 = p.x * cosY - p.z * sinY;
            let z1 = p.x * sinY + p.z * cosY;
            let y1 = p.y;
            
            let y2 = y1 * cosX - z1 * sinX;
            let z2 = y1 * sinX + z1 * cosX;
            let x2 = x1;
            
            const scale = 300 / (300 + z2);
            const x2d = width/2 + x2 * scale;
            const y2d = height/2 - y2 * scale;
            const size = Math.max(2, 6 * scale);
            const brightness = 0.7 + 0.3 * (z2 / 150);
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${p.hue}, 80%, ${60 * brightness}%)`;
            ctx.fill();
            
            if (scale > 0.8) {
                ctx.shadowColor = 'rgba(100, 180, 255, 0.5)';
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowBlur = 0;
            }
            
            if (scale > 0.7 && !explodeAnimation) {
                ctx.font = 'bold 10px "Inter", sans-serif';
                ctx.fillStyle = 'white';
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.fillText(p.skill, x2d - 15, y2d - 10);
            }
        });
        
        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }
    
    draw();
}