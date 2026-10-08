/**
 * Modern Ambient Aurora & Constellation Canvas (Clean Aesthetic)
 * - Ultra-smooth 60 FPS floating ambient gradient orbs (Indigo, Purple, Cyan)
 * - Micro interactive particles that subtly follow cursor motion
 */
(function () {
    'use strict';

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let animFrameId = null;

    const bgCanvas = document.getElementById('login-bg-canvas');
    const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
    let bgWidth = 0, bgHeight = 0;
    let particles = [];
    const PARTICLE_COUNT = 38;

    function resizeBgCanvas() {
        if (!bgCanvas || !bgCtx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        bgWidth = window.innerWidth;
        bgHeight = window.innerHeight;
        bgCanvas.width = bgWidth * dpr;
        bgCanvas.height = bgHeight * dpr;
        bgCanvas.style.width = bgWidth + 'px';
        bgCanvas.style.height = bgHeight + 'px';
        bgCtx.scale(dpr, dpr);
        initParticles();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * bgWidth,
                y: Math.random() * bgHeight,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 2.2 + 0.8,
                alpha: Math.random() * 0.5 + 0.15,
                pulseSpeed: Math.random() * 0.002 + 0.001,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function drawAmbientBackground(time) {
        if (!bgCtx || bgWidth === 0 || bgHeight === 0) return;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;

        // 1. Transparent Clear Canvas (Background Photo shines through in HD)
        bgCtx.clearRect(0, 0, bgWidth, bgHeight);

        // 2. Subtle Transparent Floating Glow (Golden & Cyan Ambient Highlights)
        const orb1X = bgWidth * 0.35 + Math.sin(time * 0.0008) * 80 + mouseX * 40;
        const orb1Y = bgHeight * 0.38 + Math.cos(time * 0.0007) * 60 + mouseY * 30;
        const grad1 = bgCtx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, bgWidth * 0.35);
        grad1.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        grad1.addColorStop(0.5, 'rgba(217, 119, 6, 0.04)');
        grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        bgCtx.fillStyle = grad1;
        bgCtx.fillRect(0, 0, bgWidth, bgHeight);

        const orb2X = bgWidth * 0.68 + Math.cos(time * 0.0009) * 90 - mouseX * 30;
        const orb2Y = bgHeight * 0.62 + Math.sin(time * 0.0008) * 70 - mouseY * 20;
        const grad2 = bgCtx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, bgWidth * 0.35);
        grad2.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
        grad2.addColorStop(0.5, 'rgba(79, 70, 229, 0.03)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        bgCtx.fillStyle = grad2;
        bgCtx.fillRect(0, 0, bgWidth, bgHeight);

        // 3. Floating Ambient Stardust
        bgCtx.save();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = bgWidth;
            if (p.x > bgWidth) p.x = 0;
            if (p.y < 0) p.y = bgHeight;
            if (p.y > bgHeight) p.y = 0;

            const pulse = 0.7 + 0.3 * Math.sin(time * p.pulseSpeed + p.pulseOffset);

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const lineAlpha = (1 - dist / 100) * 0.12 * pulse;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p.x, p.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
                    bgCtx.lineWidth = 0.6;
                    bgCtx.stroke();
                }
            }

            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
            bgCtx.fillStyle = '#c7d2fe';
            bgCtx.globalAlpha = p.alpha * pulse;
            bgCtx.fill();
        }
        bgCtx.restore();
    }

    function animate(time) {
        drawAmbientBackground(time || 0);
        animFrameId = requestAnimationFrame(animate);
    }

    window.set3DState = function (state) {
        const card = document.getElementById('login-card-element');
        if (!card) return;
        if (state === 'angry' || state === 'error') {
            card.classList.remove('shake');
            void card.offsetWidth;
            card.classList.add('shake');
        }
    };

    window.stopLoginAnimation = function () {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    };
    window.disableCursorTrail = window.stopLoginAnimation;

    window.addEventListener('pointermove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    window.addEventListener('resize', resizeBgCanvas);

    function init() {
        resizeBgCanvas();
        animate(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
