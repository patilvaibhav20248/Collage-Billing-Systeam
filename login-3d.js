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
    let logoFlipAngle = 0;
    let flipAxis = 'y'; // Horizontal 3D coin spin (front to back, never upper to lower)
    let scanAngle = 0;
    let stateTimer = 0;
    let pulseScale = 1;

    // College / Deccan Education Society 3D Rotating Emblem Logo
    const LOGO_LOCAL_BACKUP = 'college-logo.webp';
    const LOGO_REMOTE_SRC = 'https://th.bing.com/th/id/OIP.s-VkdMxzUHqHXTL7M_UqiwAAAA?w=100&h=100&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
    const logoImg = new Image();
    let isLogoLoaded = false;

    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = function () {
        isLogoLoaded = true;
    };
    logoImg.onerror = function () {
        if (logoImg.src !== LOGO_REMOTE_SRC && !logoImg.src.includes('bing.com')) {
            logoImg.src = LOGO_REMOTE_SRC;
        }
    };
    // Prioritize instant local load
    logoImg.src = LOGO_LOCAL_BACKUP;

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
        coreCanvas.style.width = '170px';
        coreCanvas.style.height = '170px';
        coreCanvas.style.display = 'block';
        coreCanvas.style.margin = '0 auto';
        coreCanvas.title = 'Willingdon College 3D Emblem';

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        coreCanvas.width = 170 * dpr;
        coreCanvas.height = 170 * dpr;
        coreCtx = coreCanvas.getContext('2d');
        coreCtx.scale(dpr, dpr);

        container.appendChild(coreCanvas);
    }

    function drawCyberCore(time) {
        if (!coreCtx || !coreCanvas) return;
        const ctx = coreCtx;
        const size = 170;
        const cx = size * 0.5;
        const cy = size * 0.5;

        ctx.clearRect(0, 0, size, size);

        // Reduced speed: smooth, slow, and graceful rotation
        logoFlipAngle += 0.009 * activeTheme.speed;
        pulseScale = 1 + 0.025 * Math.sin(time * 0.003);

        ctx.save();
        ctx.translate(cx, cy);

        // 1. Soft Ambient Holographic Aura behind the coin
        const aura = ctx.createRadialGradient(0, 0, 15, 0, 0, 84);
        aura.addColorStop(0, activeTheme.glow);
        aura.addColorStop(0.65, 'rgba(0, 240, 255, 0.08)');
        aura.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, 84, 0, Math.PI * 2);
        ctx.fill();

        // 2. High-tech Shield / Lock Icon in Core for Errors / Success
        if (currentState === 'angry' || currentState === 'error') {
            const hexRadius = 50;
            ctx.beginPath();
            for (let h = 0; h < 6; h++) {
                const angle = (h * Math.PI) / 3;
                const x = Math.cos(angle) * hexRadius;
                const y = Math.sin(angle) * hexRadius;
                if (h === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(10, 20, 38, 0.92)';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = activeTheme.primary;
            ctx.stroke();

            // Cyber Lock Icon (Warning)
            ctx.fillStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.rect(-12, -5, 24, 22);
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.arc(0, -7, 9, Math.PI, 0);
            ctx.stroke();
        } else if (currentState === 'success') {
            const hexRadius = 50;
            ctx.beginPath();
            for (let h = 0; h < 6; h++) {
                const angle = (h * Math.PI) / 3;
                const x = Math.cos(angle) * hexRadius;
                const y = Math.sin(angle) * hexRadius;
                if (h === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(10, 20, 38, 0.92)';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = activeTheme.primary;
            ctx.stroke();

            // Cyber Checkmark / Unlocked
            ctx.lineWidth = 4;
            ctx.strokeStyle = activeTheme.primary;
            ctx.beginPath();
            ctx.moveTo(-13, 0);
            ctx.lineTo(-4, 10);
            ctx.lineTo(14, -10);
            ctx.stroke();
        } else {
            // ==========================================
            // WHOLE 3D COIN REVOLVING HORIZONTALLY (FRONT TO BACK)
            // Never upper to lower, slow smooth speed
            // ==========================================
            const coinRadius = 65; // Whole coin radius (diameter 130px!)
            const coinThickness = 12; // 3D edge thickness

            const theta = logoFlipAngle;
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);
            const isFront = cosT >= 0;

            ctx.save();
            ctx.scale(pulseScale, pulseScale);

            drawWholeCoin(ctx, coinRadius, coinThickness, cosT, sinT, isFront, time);

            ctx.restore();
        }

        ctx.restore();
    }

    function drawWholeCoin(ctx, R, thickness, cosT, sinT, isFront, time) {
        const absCos = Math.max(0.012, Math.abs(cosT));
        const absSin = Math.abs(sinT);

        // Subtle 3D perspective foreshortening
        const pFactor = 1 + 0.06 * (isFront ? absSin : -absSin);

        ctx.save();

        // ==========================================
        // HORIZONTAL 3D COIN SPIN (Revolve along Y-axis, front to back)
        // ==========================================
        const xOffset = (thickness * 0.5) * sinT;

        // 1. 3D Extruded Cylindrical Rim (Milled Edge Teeth & Metallic Thickness)
        if (absCos < 0.96) {
            ctx.save();

            const rimGrad = ctx.createLinearGradient(0, -R, 0, R);
            rimGrad.addColorStop(0, 'rgba(10, 25, 48, 0.95)');
            rimGrad.addColorStop(0.2, activeTheme.primary);
            rimGrad.addColorStop(0.5, '#ffffff'); // bright light gleam on coin rim
            rimGrad.addColorStop(0.8, activeTheme.secondary);
            rimGrad.addColorStop(1, 'rgba(10, 25, 48, 0.95)');

            ctx.fillStyle = rimGrad;
            ctx.beginPath();
            if (sinT >= 0) {
                ctx.ellipse(-xOffset, 0, R * absCos, R, 0, Math.PI * 0.5, Math.PI * 1.5, false);
                ctx.ellipse(xOffset, 0, R * absCos, R, 0, Math.PI * 1.5, Math.PI * 0.5, true);
            } else {
                ctx.ellipse(xOffset, 0, R * absCos, R, 0, Math.PI * 0.5, Math.PI * 1.5, false);
                ctx.ellipse(-xOffset, 0, R * absCos, R, 0, Math.PI * 1.5, Math.PI * 0.5, true);
            }
            ctx.closePath();
            ctx.fill();

            // Milled coin ridges on rim (reeding teeth)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.3;
            const teethCount = 38;
            for (let i = 0; i <= teethCount; i++) {
                const ty = -R + (i / teethCount) * (R * 2);
                const archX = Math.sqrt(Math.max(0, R * R - ty * ty)) * absCos;
                const baseX = sinT >= 0 ? archX : -archX;
                ctx.beginPath();
                ctx.moveTo(baseX - xOffset, ty);
                ctx.lineTo(baseX + xOffset, ty);
                ctx.stroke();
            }

            ctx.restore();
        }

        // 2. Active Coin Face (Front or Back)
        ctx.save();
        ctx.translate(xOffset, 0);
        ctx.scale(cosT * pFactor, pFactor);
        drawCoinFace(ctx, R, isFront, time, sinT);
        ctx.restore();

        ctx.restore();
    }

    function drawCoinFace(ctx, R, isFront, time, sinT) {
        const logoR = 49; // Emblem radius (diameter 98px!)

        // 1. Outer Coin Base & Raised Metallic Rim
        const rimGrad = ctx.createRadialGradient(0, 0, R - 12, 0, 0, R);
        rimGrad.addColorStop(0, '#0a1628');
        rimGrad.addColorStop(0.55, activeTheme.primary);
        rimGrad.addColorStop(0.85, '#ffffff'); // Chamfer highlight
        rimGrad.addColorStop(1, activeTheme.secondary);

        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();

        // 2. Milled Coin Serrations (Circumferential Ridges / Coin Teeth)
        ctx.save();
        ctx.strokeStyle = activeTheme.primary;
        ctx.lineWidth = 1.8;
        const notches = 42;
        for (let i = 0; i < notches; i++) {
            const a = (i * Math.PI * 2) / notches;
            const x1 = Math.cos(a) * (R - 5);
            const y1 = Math.sin(a) * (R - 5);
            const x2 = Math.cos(a) * (R - 1);
            const y2 = Math.sin(a) * (R - 1);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.restore();

        // 3. Inner Stepped Bevel Ring
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, R - 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = activeTheme.primary;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeTheme.primary;
        ctx.beginPath();
        ctx.arc(0, 0, logoR + 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 4. Coin Field Content (Front vs Back)
        if (isFront) {
            // ==========================================
            // FRONT FACE: Willingdon College Crest
            // ==========================================
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, logoR + 1.5, 0, Math.PI * 2);
            ctx.fill();

            if (isLogoLoaded) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, logoR, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(logoImg, -logoR, -logoR, logoR * 2, logoR * 2);
                ctx.restore();
            } else {
                ctx.fillStyle = activeTheme.primary;
                ctx.beginPath();
                ctx.moveTo(0, -22); ctx.lineTo(16, 0); ctx.lineTo(0, 22); ctx.lineTo(-16, 0);
                ctx.closePath();
                ctx.fill();
            }

            // Dynamic Specular Light Gleam on Front
            const gleam = ctx.createLinearGradient(-R, -R, R, R);
            const gPos = (sinT + 1) * 0.5;
            gleam.addColorStop(Math.max(0, gPos - 0.25), 'rgba(255, 255, 255, 0)');
            gleam.addColorStop(Math.min(1, Math.max(0, gPos)), 'rgba(255, 255, 255, 0.45)');
            gleam.addColorStop(Math.min(1, gPos + 0.25), 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gleam;
            ctx.beginPath();
            ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fill();

        } else {
            // ==========================================
            // BACK FACE: Minted Metallic Coin Reverse (Un-mirrored)
            // ==========================================
            ctx.save();
            ctx.scale(-1, 1); // Un-mirror so text and crest are upright and legible!

            const backGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, logoR);
            backGrad.addColorStop(0, '#0a1a32');
            backGrad.addColorStop(0.7, '#071224');
            backGrad.addColorStop(1, '#030812');
            ctx.fillStyle = backGrad;
            ctx.beginPath();
            ctx.arc(0, 0, logoR + 1.5, 0, Math.PI * 2);
            ctx.fill();

            if (isLogoLoaded) {
                // Embossed emblem on the reverse with cyber holographic finish
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, logoR, 0, Math.PI * 2);
                ctx.clip();
                ctx.globalAlpha = 0.86;
                ctx.drawImage(logoImg, -logoR, -logoR, logoR * 2, logoR * 2);
                ctx.restore();

                const holoGrad = ctx.createLinearGradient(-logoR, -logoR, logoR, logoR);
                holoGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
                holoGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
                holoGrad.addColorStop(1, 'rgba(0, 255, 157, 0.3)');
                ctx.fillStyle = holoGrad;
                ctx.beginPath();
                ctx.arc(0, 0, logoR, 0, Math.PI * 2);
                ctx.fill();
            }

            // Engraved concentric medal rings
            ctx.strokeStyle = activeTheme.primary;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(0, 0, logoR - 4, 0, Math.PI * 2);
            ctx.stroke();

            // Reverse Specular Gleam
            const gleam = ctx.createLinearGradient(-R, R, R, -R);
            const gPos = (sinT + 1) * 0.5;
            gleam.addColorStop(Math.max(0, gPos - 0.25), 'rgba(0, 240, 255, 0)');
            gleam.addColorStop(Math.min(1, Math.max(0, gPos)), 'rgba(255, 255, 255, 0.4)');
            gleam.addColorStop(Math.min(1, gPos + 0.25), 'rgba(0, 240, 255, 0)');
            ctx.fillStyle = gleam;
            ctx.beginPath();
            ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // 5. Outer Bezel Chamfer Ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, R - 1, 0, Math.PI * 2);
        ctx.stroke();
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

    window.setLogoFlipMode = function (mode) {
        if (mode === 'x' || mode === 'vertical') flipAxis = 'x';
        else if (mode === 'tilt' || mode === 'diagonal') flipAxis = 'tilt';
        else flipAxis = 'y';
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
