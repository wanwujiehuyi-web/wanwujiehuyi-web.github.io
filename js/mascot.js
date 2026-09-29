(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #starship-mascot {
            position: fixed; bottom: 50px; left: 50px;
            width: 18px;
            height: 100px;
            cursor: pointer; z-index: 999999;
            transform-origin: center bottom;
            will-change: transform;
        }
        #starship-mascot.hover-idle { animation: hoverFloat 4s ease-in-out infinite; }
        @keyframes hoverFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        #starship-mascot:hover { filter: drop-shadow(0 0 12px rgba(255,255,255,0.6)); }

        /* 圆柱体舰身 */
        .starship-body {
            position: absolute; bottom: 0; width: 100%; height: 72px;
            background: linear-gradient(to right, #4a4a4a, #b8b8b8, #e8e8e8, #9a9a9a, #3a3a3a);
            border-radius: 0 0 1px 1px;
            box-shadow: inset 0 0 6px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.9);
            overflow: hidden;
        }
        /* 隔热瓦：背面 55% */
        .starship-tiles {
            position: absolute; bottom: 0; right: 0; width: 55%; height: 100%;
            background:
                repeating-linear-gradient(60deg, transparent, transparent 2px, rgba(0,0,0,0.7) 2px, rgba(0,0,0,0.7) 3px),
                repeating-linear-gradient(-60deg, transparent, transparent 2px, rgba(0,0,0,0.7) 2px, rgba(0,0,0,0.7) 3px);
            background-color: #141414;
            opacity: 0.95;
        }
        /* 尖锥机头 */
        .starship-nose {
            position: absolute; top: 0; left: 0; width: 100%; height: 28px;
            background: linear-gradient(to right, #4a4a4a, #b8b8b8, #e8e8e8, #9a9a9a);
            clip-path: polygon(50% 0%, 88% 55%, 100% 100%, 0% 100%, 12% 55%);
            z-index: 2;
        }
        /* 尾翼 */
        .starship-fin {
            position: absolute; bottom: 0; width: 6px; height: 11px;
            background: linear-gradient(to top, #1a1a1a, #555);
            z-index: 3;
        }
        .fin-left { left: -5px; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
        .fin-right { right: -5px; clip-path: polygon(0 0, 100% 100%, 0 100%); }
        /* 发动机喷口 */
        .starship-engines {
            position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
            width: 14px; height: 4px; display: flex; justify-content: space-around;
            z-index: 4;
        }
        .engine-nozzle {
            width: 3px; height: 4px;
            background: radial-gradient(circle at 50% 0%, #333, #111);
            border-radius: 0 0 50% 50%;
            border: 1px solid #444;
        }
        /* 尾焰 */
        .starship-flame {
            position: absolute; bottom: -45px; left: 50%; transform: translateX(-50%) scale(0);
            width: 22px; height: 55px;
            background: radial-gradient(ellipse at 50% 0%, #ffffff 0%, #ffffaa 8%, #ffdd00 20%, #ff8800 45%, #ff4400 70%, #cc0000 88%, transparent 100%);
            border-radius: 50% 50% 30% 30% / 60% 60% 40% 40%;
            filter: blur(3px) drop-shadow(0 0 22px #ff8800);
            transform-origin: top center;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 0;
        }
        .starship-flame.active { opacity: 1; }

        /* ===== SpaceX 风格倒计时 HUD ===== */
        .launch-hud {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            background: rgba(8, 8, 10, 0.92);
            backdrop-filter: blur(24px) saturate(140%);
            -webkit-backdrop-filter: blur(24px) saturate(140%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 2px;
            padding: 36px 72px;
            color: #ffffff;
            font-family: 'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 72px;
            font-weight: 200;
            letter-spacing: 8px;
            line-height: 1;
            z-index: 1000000;
            opacity: 0;
            pointer-events: none;
            transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
            text-align: center;
            font-variant-numeric: tabular-nums;
        }
        .launch-hud::before,
        .launch-hud::after {
            content: '';
            position: absolute;
            left: 24px; right: 24px;
            height: 1px;
            background: rgba(255, 255, 255, 0.2);
        }
        .launch-hud::before { top: 18px; }
        .launch-hud::after  { bottom: 18px; }
        .launch-hud.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        .launch-hud span {
            font-size: 11px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.55);
            display: block;
            margin-top: 16px;
            letter-spacing: 6px;
            text-transform: uppercase;
            font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }

        .smoke-particle {
            position: fixed; border-radius: 50%;
            z-index: 999998; pointer-events: none; filter: blur(4px);
            animation: smokeExpand 3s ease-out forwards;
        }
        @keyframes smokeExpand {
            0%   { transform: scale(0.5); opacity: 0.9; }
            100% { transform: scale(8); opacity: 0; }
        }
        .pressure-wave {
            position: fixed; border-radius: 50%; border: 3px solid rgba(255,255,255,0.7);
            z-index: 999997; pointer-events: none;
            animation: waveExpand 1.5s ease-out forwards;
        }
        @keyframes waveExpand {
            0%   { transform: scale(0); opacity: 0.9; }
            100% { transform: scale(18); opacity: 0; }
        }

        #body-wrap.shake-light  { animation: screenShakeLight 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        #body-wrap.shake-medium { animation: screenShakeMedium 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        #body-wrap.shake-heavy  { animation: screenShakeHeavy 1.0s cubic-bezier(.36,.07,.19,.97) both; }
        #body-wrap.shake-rumble { animation: screenRumble 0.08s linear infinite; }

        @keyframes screenShakeLight {
            0%   { transform: translate(0, 0); }
            20%  { transform: translate(-2px, 1px); }
            40%  { transform: translate(2px, -1px); }
            60%  { transform: translate(-1px, 2px); }
            80%  { transform: translate(1px, -2px); }
            100% { transform: translate(0, 0); }
        }
        @keyframes screenShakeMedium {
            0%   { transform: translate(0, 0); }
            15%  { transform: translate(-4px, 3px); }
            30%  { transform: translate(4px, -3px); }
            45%  { transform: translate(-4px, -3px); }
            60%  { transform: translate(4px, 3px); }
            75%  { transform: translate(-3px, 2px); }
            90%  { transform: translate(3px, -2px); }
            100% { transform: translate(0, 0); }
        }
        @keyframes screenShakeHeavy {
            0%   { transform: translate(0, 0); }
            10%  { transform: translate(-8px, 6px); }
            20%  { transform: translate(8px, -6px); }
            30%  { transform: translate(-7px, -5px); }
            40%  { transform: translate(7px, 5px); }
            50%  { transform: translate(-6px, 4px); }
            60%  { transform: translate(6px, -4px); }
            70%  { transform: translate(-4px, 3px); }
            80%  { transform: translate(4px, -3px); }
            90%  { transform: translate(-2px, 2px); }
            100% { transform: translate(0, 0); }
        }
        @keyframes screenRumble {
            0%   { transform: translate(0, 0); }
            25%  { transform: translate(-1px, 1px); }
            50%  { transform: translate(1px, -1px); }
            75%  { transform: translate(-1px, -1px); }
            100% { transform: translate(0, 0); }
        }
    `;
    document.head.appendChild(style);

    const rocket = document.createElement('div');
    rocket.id = 'starship-mascot';
    rocket.className = 'hover-idle';
    rocket.innerHTML = `
        <div class="starship-body"><div class="starship-tiles"></div></div>
        <div class="starship-nose"></div>
        <div class="starship-fin fin-left"></div>
        <div class="starship-fin fin-right"></div>
        <div class="starship-engines">
            <div class="engine-nozzle"></div>
            <div class="engine-nozzle"></div>
            <div class="engine-nozzle"></div>
        </div>
        <div class="starship-flame"></div>
    `;
    document.body.appendChild(rocket);

    const flame = rocket.querySelector('.starship-flame');

    const hud = document.createElement('div');
    hud.className = 'launch-hud';
    document.body.appendChild(hud);

    let isLaunching = false;
    let audioCtx = null;
    let roarGain = null;
    let roarSource = null;
    let roarCrackle = null;
    let rumbleOn = false;

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    const shakeTarget = () => document.getElementById('body-wrap') || document.body;

    function shake(level) {
        const target = shakeTarget();
        target.classList.remove('shake-light', 'shake-medium', 'shake-heavy');
        void target.offsetWidth;
        target.classList.add('shake-' + level);
        setTimeout(() => target.classList.remove('shake-' + level), 1200);
    }

    function startRumble() {
        if (rumbleOn) return;
        rumbleOn = true;
        shakeTarget().classList.add('shake-rumble');
    }

    function stopRumble() {
        if (!rumbleOn) return;
        rumbleOn = false;
        shakeTarget().classList.remove('shake-rumble');
    }

    function playCountdownBeep(freq, duration) {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    }

    function startRoar() {
        try {
            const ctx = getAudioCtx();
            const duration = 20.0;
            const sampleRate = ctx.sampleRate;
            const length = sampleRate * duration;

            const buffer = ctx.createBuffer(1, length, sampleRate);
            const data = buffer.getChannelData(0);
            let lastOut = 0;
            for (let i = 0; i < length; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + 0.02 * white) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5;
            }

            roarSource = ctx.createBufferSource();
            roarSource.buffer = buffer;
            roarSource.loop = true;

            const lowpass = ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.value = 200;
            lowpass.Q.value = 1.5;

            roarGain = ctx.createGain();
            roarGain.gain.value = 0;

            const crackleBuffer = ctx.createBuffer(1, length, sampleRate);
            const crackleData = crackleBuffer.getChannelData(0);
            for (let i = 0; i < length; i++) {
                crackleData[i] = Math.random() < 0.003 ? (Math.random() * 2 - 1) : 0;
            }
            roarCrackle = ctx.createBufferSource();
            roarCrackle.buffer = crackleBuffer;
            roarCrackle.loop = true;
            const crackleGain = ctx.createGain();
            crackleGain.gain.value = 0.1;

            roarSource.connect(lowpass);
            lowpass.connect(roarGain);
            roarGain.connect(ctx.destination);

            roarCrackle.connect(crackleGain);
            crackleGain.connect(ctx.destination);

            roarSource.start();
            roarCrackle.start();
        } catch(e) { console.log('Roar error:', e); }
    }

    function setRoarVolume(v) {
        if (roarGain) roarGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), getAudioCtx().currentTime, 0.05);
    }

    function stopRoar() {
        try {
            if (roarSource) { roarSource.stop(); roarSource.disconnect(); roarSource = null; }
            if (roarCrackle) { roarCrackle.stop(); roarCrackle.disconnect(); roarCrackle = null; }
            if (roarGain) { roarGain.disconnect(); roarGain = null; }
        } catch(e) {}
    }

    function createSmoke(x, y, count, spread) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-particle';
                const size = 15 + Math.random() * 30;
                smoke.style.width = size + 'px';
                smoke.style.height = size + 'px';
                smoke.style.left = (x + (Math.random() - 0.5) * spread) + 'px';
                smoke.style.bottom = (y + Math.random() * 20) + 'px';
                const gray = 140 + Math.random() * 100;
                smoke.style.background = `radial-gradient(circle, rgba(${gray},${gray},${gray},0.85), rgba(80,80,80,0.05))`;
                document.body.appendChild(smoke);
                setTimeout(() => smoke.remove(), 3000);
            }, i * 20);
        }
    }

    function createWave(x, y) {
        const wave = document.createElement('div');
        wave.className = 'pressure-wave';
        wave.style.width = '60px';
        wave.style.height = '60px';
        wave.style.left = (x - 30) + 'px';
        wave.style.bottom = (y - 30) + 'px';
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 1500);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function easeInQuad(t) { return t * t; }

    function animate(duration, updateFn, doneFn) {
        const startTime = performance.now();
        function frame(now) {
            const t = Math.min((now - startTime) / duration, 1);
            updateFn(t);
            if (t < 1) requestAnimationFrame(frame);
            else if (doneFn) doneFn();
        }
        requestAnimationFrame(frame);
    }

    function setTransform(y, scale, rot) {
        rocket.style.transform = `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
    }

    rocket.addEventListener('click', function() {
        if (isLaunching) return;
        isLaunching = true;
        rocket.classList.remove('hover-idle');
        rocket.style.transform = '';

        const countdown = ['T-00:00:03', 'T-00:00:02', 'T-00:00:01', 'LIFTOFF'];

        const doCountdown = () => {
            if (countdown.length > 0) {
                const label = countdown.shift();
                hud.innerHTML = label + '<span>Starship Launch Sequence</span>';
                hud.classList.add('show');

                if (label !== 'LIFTOFF') {
                    playCountdownBeep(500, 0.2);
                    setTimeout(doCountdown, 1000);
                } else {
                    hud.classList.remove('show');
                    startFlight();
                }
            }
        };

        doCountdown();
    });

    function startFlight() {
        flame.classList.add('active');
        flame.style.transition = 'opacity 0.3s';
        flame.style.transform = 'translateX(-50%) scale(1.5)';
        startRoar();

        shake('heavy');
        setTimeout(() => startRumble(), 200);

        const screenH = window.innerHeight;
        const upDistance = screenH + 200;

        setRoarVolume(0.7);

        animate(3500, (t) => {
            const eased = easeInQuad(t);
            const y = -eased * upDistance;
            const scale = 1 - eased * 0.5;
            setTransform(y, scale, 0);

            setRoarVolume(0.7 * (1 - eased * 0.6));

            if (t < 0.15 && Math.random() < 0.5) {
                createSmoke(50, 50, 1, 40);
            }
        }, () => {
            flame.classList.remove('active');
            setRoarVolume(0.15);
            stopRumble();

            setTimeout(() => {
                flame.classList.add('active');
                setTransform(-upDistance, 0.5, 180);
                setRoarVolume(0.5);

                shake('medium');
                setTimeout(() => startRumble(), 200);

                animate(4000, (t) => {
                    const eased = easeInOutCubic(t);
                    const y = -upDistance + eased * (upDistance - 60);
                    const scale = 0.5 + eased * 0.5;
                    const rot = 180 - eased * 180;
                    setTransform(y, scale, rot);

                    setRoarVolume(0.4 + eased * 0.5);
                }, () => {
                    setTransform(0, 1, 0);
                    flame.style.transform = 'translateX(-50%) scale(0)';

                    stopRumble();
                    shake('heavy');

                    setTimeout(() => flame.classList.remove('active'), 200);
                    setRoarVolume(0.9);
                    createSmoke(50, 50, 30, 100);
                    createWave(50, 50);
                    setTimeout(() => createWave(50, 50), 200);

                    setRoarVolume(0.3);
                    setTimeout(() => {
                        stopRoar();
                        setRoarVolume(0);
                    }, 600);

                    setTimeout(() => {
                        rocket.classList.add('hover-idle');
                        isLaunching = false;
                    }, 800);
                });
            }, 800);
        });
    }
})();
