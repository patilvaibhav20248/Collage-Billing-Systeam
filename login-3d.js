/**
 * SIMPLE CYBER ANIMATION (Pure Canvas 2D)
 * - Lightweight, high-performance 60 FPS cyber aesthetic
 * - Perspective Cyber Grid with smooth horizon motion
 * - Floating cyber data constellation with dynamic circuit lines
 * - Interactive Holographic Cyber Core on login card with state reactions
 */
(function () {
    'use strict';

    // State Variables
    let currentState = 'idle';
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let gridOffset = 0;
    let coreRotation = 0;
    let logoRotation = 0;
    let scanAngle = 0;
    let stateTimer = 0;
    let pulseScale = 1;

    // College / Deccan Education Society Rotating Emblem Logo
    const LOGO_SRC = 'https://th.bing.com/th/id/OIP.s-VkdMxzUHqHXTL7M_UqiwAAAA?w=100&h=100&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
    const LOGO_LOCAL_BACKUP = 'college-logo.webp';
    const logoImg = new Image();
    let isLogoLoaded = false;

    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = function () {
        isLogoLoaded = true;
    };
    logoImg.onerror = function () {
        if (logoImg.src !== LOGO_LOCAL_BACKUP && !logoImg.src.endsWith(LOGO_LOCAL_BACKUP)) {
            logoImg.src = LOGO_LOCAL_BACKUP;
        }
    };
    logoImg.src = LOGO_SRC;

    // Theme Color Palettes for States
    const CYBER_THEMES = {
        idle: { primary: '#00f0ff', secondary: '#3b82f6', glow: 'rgba(0, 240, 255, 0.4)', speed: 1.0 },
        username: { primary: '#00ff9d', secondary: '#00d2ff', glow: 'rgba(0, 255, 157, 0.5)', speed: 1.4 },
        password: { primary: '#38bdf8', secondary: '#818cf8', glow: 'rgba(56, 189, 248, 0.5)', speed: 1.8 },
        ready: { primary: '#00ff9d', secondary: '#10b981', glow: 'rgba(0, 255, 157, 0.6)', speed: 1.6 },
        success: { primary: '#00ff88', secondary: '#06b6d4', glow: 'rgba(0, 255, 136, 0.8)', speed: 3.0 },
        angry: { primary: '#ff2a5f', secondary: '#f43f5e', glow: 'rgba(255, 42, 95, 0.7)', speed: 2.2 },
        error: { primary: '#ff2a5f', secondary: '#f43f5e', glow: 'rgba(255, 42, 95, 0.7)', speed: 2.2 }
    };

    let activeTheme = CYBER_THEMES.idle;

    // ==========================================
    // 1. BACKGROUND CYBER GRID & NETWORK PARTICLES
    // ==========================================
    const bgCanvas = document.getElementById('login-bg-canvas');
    const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
    let bgWidth = 0, bgHeight = 0;
    let particles = [];
    const PARTICLE_COUNT = 45;

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
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.6 + 0.2,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function drawCyberBackground(time) {
        if (!bgCtx || bgWidth === 0 || bgHeight === 0) return;

        // Smooth mouse glide
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // 1. Deep Space Cyber Gradient
        const gradient = bgCtx.createRadialGradient(
            bgWidth * 0.5 + mouseX * 50, bgHeight * 0.45 + mouseY * 30, 20,
            bgWidth * 0.5, bgHeight * 0.5, Math.max(bgWidth, bgHeight) * 0.85
        );
        gradient.addColorStop(0, '#0a1428');
        gradient.addColorStop(0.5, '#060b16');
        gradient.addColorStop(1, '#020409');
        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, bgWidth, bgHeight);

        // 2. Horizon Glow
        const horizonY = bgHeight * 0.54 + mouseY * 25;
        const horizonGlow = bgCtx.createLinearGradient(0, horizonY - 120, 0, horizonY + 80);
        horizonGlow.addColorStop(0, 'rgba(0, 240, 255, 0)');
        horizonGlow.addColorStop(0.6, 'rgba(0, 240, 255, 0.12)');
        horizonGlow.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
        bgCtx.fillStyle = horizonGlow;
        bgCtx.fillRect(0, horizonY - 120, bgWidth, 200);

        // 3. Perspective Cyber Grid (Floor)
        bgCtx.save();
        bgCtx.lineWidth = 1;

        // Perspective vertical lines
        const vanishingX = bgWidth * 0.5 + mouseX * 80;
        const lineCount = 28;
        const spread = bgWidth * 1.6;

        for (let i = 0; i <= lineCount; i++) {
            const bottomX = (bgWidth * 0.5 - spread * 0.5) + (i / lineCount) * spread;
            bgCtx.beginPath();
            bgCtx.moveTo(vanishingX, horizonY);
            bgCtx.lineTo(bottomX, bgHeight);
            const distFromCenter = Math.abs(i - lineCount / 2) / (lineCount / 2);
            const alpha = Math.max(0, (1 - distFromCenter * 0.7) * 0.22);
            bgCtx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            bgCtx.stroke();
        }

        // Horizontal perspective lines scrolling forward
        gridOffset = (gridOffset + 0.4 * activeTheme.speed) % 1;
        const depthLevels = 14;

        for (let j = 0; j < depthLevels; j++) {
            const p = (j + gridOffset) / depthLevels;
            const y = horizonY + Math.pow(p, 2.2) * (bgHeight - horizonY);
            const alpha = Math.pow(p, 1.5) * 0.35;

            bgCtx.beginPath();
            bgCtx.moveTo(0, y);
            bgCtx.lineTo(bgWidth, y);
            bgCtx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            bgCtx.stroke();
        }
        bgCtx.restore();

        // 4. Floating Cyber Data Nodes & Circuit Lines
        bgCtx.save();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrapping
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

                if (dist < 115) {
                    const lineAlpha = (1 - dist / 115) * 0.25 * pulse;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p.x, p.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
                    bgCtx.lineWidth = 0.8;
                    bgCtx.stroke();
                }
            }

            // Draw glowing node
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
            bgCtx.fillStyle = activeTheme.primary;
            bgCtx.globalAlpha = p.alpha * pulse;
            bgCtx.shadowBlur = 8;
            bgCtx.shadowColor = activeTheme.primary;
            bgCtx.fill();
            bgCtx.globalAlpha = 1.0;
            bgCtx.shadowBlur = 0;
        }
        bgCtx.restore();
    }

    // ==========================================
    // 2. CYBER EMBLEM CORE (LOGIN CARD)
    // ==========================================
    let coreCanvas = null;
    let coreCtx = null;

    function initCoreCanvas() {
        const container = document.getElementById('login-3d-container');
        if (!container) return;
        container.innerHTML = '';

        coreCanvas = document.createElement('canvas');
        coreCanvas.className = 'cyber-emblem-canvas';
        coreCanvas.style.width = '120px';
        coreCanvas.style.height = '120px';
        coreCanvas.style.display = 'block';
        coreCanvas.style.margin = '0 auto';

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        coreCanvas.width = 120 * dpr;
        coreCanvas.height = 120 * dpr;
        coreCtx = coreCanvas.getContext('2d');
        coreCtx.scale(dpr, dpr);

        container.appendChild(coreCanvas);
    }

    function drawCyberCore(time) {
        if (!coreCtx || !coreCanvas) return;
        const ctx = coreCtx;
        const size = 120;
        const cx = size * 0.5;
        const cy = size * 0.5;

        ctx.clearRect(0, 0, size, size);

        coreRotation += 0.015 * activeTheme.speed;
        logoRotation += 0.012 * activeTheme.speed;
        scanAngle = (scanAngle + 0.035 * activeTheme.speed) % (Math.PI * 2);
        pulseScale = 1 + 0.04 * Math.sin(time * 0.003);

        ctx.save();
        ctx.translate(cx, cy);

        // 1. Ambient Glow Aura
        const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 55);
        aura.addColorStop(0, activeTheme.glow);
        aura.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, 55, 0, Math.PI * 2);
        ctx.fill();

        // 2. Outer Segmented Tech Ring (Clockwise)
        ctx.save();
        ctx.rotate(coreRotation);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = activeTheme.primary;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeTheme.primary;

        const segments = 4;
        for (let i = 0; i < segments; i++) {
            const start = (i * Math.PI * 2) / segments + 0.15;
            const end = start + (Math.PI * 2) / segments - 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, 50, start, end);
            ctx.stroke();

            // Accent tech notch on ring
            const notchX = Math.cos(start) * 50;
            const notchY = Math.sin(start) * 50;
            ctx.beginPath();
            ctx.arc(notchX, notchY, 2, 0, Math.PI * 2);
            ctx.fillStyle = activeTheme.primary;
            ctx.fill();
        }
        ctx.restore();

        // 3. Middle Counter-Rotating Dashed Tech Ring
        ctx.save();
        ctx.rotate(-coreRotation * 1.3);
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = activeTheme.secondary;
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.stroke();

        // Data blip packet orbiting ring
        const blipAngle = time * 0.004 * activeTheme.speed;
        const blipX = Math.cos(blipAngle) * 40;
        const blipY = Math.sin(blipAngle) * 40;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.restore();

        // 4. Center Glowing Cyber Insignia / Rotating College Logo Core
        ctx.save();
        ctx.scale(pulseScale, pulseScale);

        // Hexagonal Cyber Frame
        const hexRadius = 26;
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
            const angle = (h * Math.PI) / 3;
            const x = Math.cos(angle) * hexRadius;
            const y = Math.sin(angle) * hexRadius;
            if (h === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(10, 20, 38, 0.9)';
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = activeTheme.primary;
        ctx.shadowBlur = 12;
        ctx.shadowColor = activeTheme.primary;
        ctx.stroke();

        // High-tech Shield / Lock Icon in Core for Errors / Success
        if (currentState === 'angry' || currentState === 'error') {
            // Cyber Lock Icon (Warning)
            ctx.fillStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.rect(-6, -2, 12, 11);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.arc(0, -3, 5, Math.PI, 0);
            ctx.stroke();
        } else if (currentState === 'success') {
            // Cyber Checkmark / Unlocked
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.lineTo(-2, 5);
            ctx.lineTo(8, -5);
            ctx.stroke();
        } else {
            // ROTATING IMAGE INSIDE THE ANIMATION
            if (isLogoLoaded) {
                ctx.save();
                ctx.rotate(logoRotation);

                // Circular clipping mask for the emblem
                const imgR = 21.5;
                ctx.beginPath();
                ctx.arc(0, 0, imgR, 0, Math.PI * 2);
                ctx.clip();

                // Crisp clean backdrop
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-imgR, -imgR, imgR * 2, imgR * 2);

                // Draw the rotating logo image
                ctx.drawImage(logoImg, -imgR, -imgR, imgR * 2, imgR * 2);
                ctx.restore();

                // Glowing circular ring & rotating tech notches
                ctx.save();
                ctx.rotate(logoRotation);
                ctx.strokeStyle = activeTheme.primary;
                ctx.lineWidth = 1.6;
                ctx.shadowBlur = 8;
                ctx.shadowColor = activeTheme.primary;
                ctx.beginPath();
                ctx.arc(0, 0, 22.5, 0, Math.PI * 2);
                ctx.stroke();

                // 4 Orbiting micro-tech notches
                for (let i = 0; i < 4; i++) {
                    const notchA = (i * Math.PI) / 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 24.5, notchA, notchA + 0.4);
                    ctx.stroke();
                }
                ctx.restore();
            } else {
                // College Academic Cyber Star / Diamond fallback
                ctx.fillStyle = activeTheme.primary;
                ctx.beginPath();
                ctx.moveTo(0, -11);
                ctx.lineTo(8, 0);
                ctx.lineTo(0, 11);
                ctx.lineTo(-8, 0);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // 5. Radar / Scanline Sweep
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 52, scanAngle, scanAngle + 0.4);
        ctx.closePath();
        const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 52);
        sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        sweepGrad.addColorStop(1, activeTheme.glow);
        ctx.fillStyle = sweepGrad;
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }

    // ==========================================
    // 3. MAIN ANIMATION LOOP
    // ==========================================
    let animFrameId = null;

    function animate(time) {
        drawCyberBackground(time || 0);
        drawCyberCore(time || 0);
        animFrameId = requestAnimationFrame(animate);
    }

    // ==========================================
    // 4. GLOBAL CONTROLLER INTERFACES
    // ==========================================
    window.set3DState = function (state) {
        currentState = state;
        activeTheme = CYBER_THEMES[state] || CYBER_THEMES.idle;

        const card = document.getElementById('login-card-element');
        if (card) {
            card.classList.remove('cyber-state-error', 'cyber-state-success', 'cyber-state-active');
            if (state === 'angry' || state === 'error') {
                card.classList.add('cyber-state-error');
                clearTimeout(stateTimer);
                stateTimer = setTimeout(() => {
                    activeTheme = CYBER_THEMES.idle;
                    currentState = 'idle';
                    card.classList.remove('cyber-state-error');
                }, 1800);
            } else if (state === 'success') {
                card.classList.add('cyber-state-success');
            } else if (state === 'password' || state === 'username' || state === 'ready') {
                card.classList.add('cyber-state-active');
            }
        }
    };

    window.set3DUsernameProgress = function (progress) {
        if (progress > 0.5 && currentState !== 'angry' && currentState !== 'success') {
            activeTheme = CYBER_THEMES.username;
        }
    };

    window.set3DPasswordProgress = function (progress) {
        if (progress > 0 && currentState !== 'angry' && currentState !== 'success') {
            activeTheme = progress >= 1.0 ? CYBER_THEMES.ready : CYBER_THEMES.password;
        }
    };

    window.disableCursorTrail = function () {
        const trail = document.getElementById('cursor-trail-canvas');
        if (trail) trail.style.display = 'none';
        if (animFrameId) {
            // Cancel background animation loop when logged in to save CPU
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen && loginScreen.style.display === 'none') {
                cancelAnimationFrame(animFrameId);
            }
        }
    };

    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================
    window.addEventListener('pointermove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    window.addEventListener('resize', () => {
        resizeBgCanvas();
    });

    // Initialize safely
    function init() {
        resizeBgCanvas();
        initCoreCanvas();
        animate(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
