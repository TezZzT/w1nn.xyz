/**
 * Main JavaScript File for Portfolio
 * Handles animations, terminal logic, and interactive effects.
 */

/* =========================================
   1. Matrix Rain Effect
   ========================================= */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const chars = '01ABCDEF';
const fontSize = 14;
const columns = width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; // Fade effect
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00ff9d';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

/* =========================================
   2. Particle Network Effect
   ========================================= */
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

// Helper to get accent color from CSS variables
function getAccentColor() {
    return getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00ff9d';
}

function drawParticles() {
    const accent = getAccentColor();
    ctx.fillStyle = accent;

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillRect(p.x, p.y, 2, 2);

        // Connect particles if close enough
        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.globalAlpha = 0.1 - dist / 1000;
                ctx.strokeStyle = accent;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        });
    });
}

function loop() {
    drawMatrix();
    drawParticles();
}

let matrixInterval = setInterval(loop, 50);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Reset drops
    const newCols = width / fontSize;
    if (newCols > drops.length) {
        for (let i = drops.length; i < newCols; i++) drops.push(1);
    }
});


/* =========================================
   3. Typewriter Effect
   ========================================= */
const typeText = document.getElementById('type-text');
const phrases = [
    "Security Researcher",
    "Reverse Engineer",
    "Low-Level Developer",
    "Exploit Developer"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typeText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typeText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', typeWriter);


/* =========================================
   4. Interactive Terminal & Boot System
   ========================================= */

// Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0.1; // Low volume
gainNode.connect(audioCtx.destination);

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gainNode);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playClick() { /* Placeholder for click sound */ }

function playBoot() { /* Placeholder for boot sound */ }

// Virtual File System
class FileSystem {
    constructor() {
        this.files = {
            'about.txt': "I am a Security Researcher focused on low-level development and reverse engineering.",
            'skills.md': "Key Skills:\n- C/C++\n- Assembly\n- Python\n- Reverse Engineering (IDA/Ghidra)\n- Malware Analysis",
            'projects.json': "[\n  { name: 'SnakeC2', type: 'C2 Server' },\n  { name: 'VulnScan', type: 'Scanner' }\n]",
            'contact.info': "GitHub: github.com/TezzzT\nEmail: root@tezzzt.io",
            'secret.bin': "PERMISSION DENIED: Encrypted content."
        };
    }

    ls() {
        return Object.keys(this.files).join('  ');
    }

    cat(filename) {
        if (this.files[filename]) return this.files[filename].replace(/\n/g, '<br>');
        return `cat: ${filename}: No such file or directory`;
    }
}

const fs = new FileSystem();

// Boot Loader
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');

async function bootSequence() {
    playBoot();
    const logs = [
        "Loading kernel modules...",
        "Mounting file system...",
        "Initializing network interfaces...",
        "System Ready."
    ];

    for (const log of logs) {
        await new Promise(r => setTimeout(r, Math.random() * 300 + 100)); // Faster boot
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = `[OK] ${log}`;
        bootLog.appendChild(line);
    }

    await new Promise(r => setTimeout(r, 100));

    // Hide boot screen completely
    bootScreen.style.display = 'none';

    // CRT Turn On Effect on Interface Wrapper
    const interfaceDiv = document.getElementById('interface');
    interfaceDiv.classList.add('crt-on');

    // Cleanup
    setTimeout(() => interfaceDiv.classList.remove('crt-on'), 700);
}

// Terminal Logic
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

if (termInput) {
    // Focus input anywhere
    document.addEventListener('keydown', (e) => {
        if (!termInput.matches(':focus')) termInput.focus();
    });

    termInput.addEventListener('keydown', function (e) {

        if (e.key === 'Enter') {
            const input = this.value.trim();
            const args = input.split(' ');
            const cmd = args[0].toLowerCase();

            addLine(`root@tezzzt:~$ ${input}`);

            switch (cmd) {
                case 'help':
                    addLine("Available commands: <span class='text-accent'>ls, cat, clear, whoami, reboot</span>");
                    break;
                case 'ls':
                    addLine(fs.ls());
                    break;
                case 'cat':
                    if (args[1]) addLine(fs.cat(args[1]));
                    else addLine("Usage: cat [filename]");
                    break;
                case 'clear':
                    termOutput.innerHTML = '';
                    break;
                case 'whoami':
                    addLine("root");
                    break;
                case 'reboot':
                    location.reload();
                    break;
                default:
                    if (cmd !== '') addLine(`Command not found: ${cmd}`);
            }

            this.value = '';
        }
    });
}

function addLine(html) {
    const div = document.createElement('div');
    div.className = 'command-line';
    div.innerHTML = html;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
}


/* =========================================
   5. Visual Effects & Interactions
   ========================================= */

// 3D Tilt Effect
document.querySelectorAll('.glass-panel').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Decrypt Text Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function decryptText(element) {
    const originalText = element.innerText;
    let iterations = 0;

    const interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 36)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 3;
    }, 30);
}

// Apply decrypt effect to headings on load
window.addEventListener('load', () => {
    bootSequence();

    // Delay decrypt until after boot (approx)
    setTimeout(() => {
        document.querySelectorAll('h1, h2, h3').forEach(el => decryptText(el));
    }, 4000);
});


/* =========================================
   6. Scroll Reveal
   ========================================= */
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-panel').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

/* =========================================
   7. HUD & Modals
   ========================================= */

// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// Modals
const modalData = {
    rev: {
        title: "Reverse Engineering",
        content: "<p>Deep analysis of compiled binaries using IDA Pro and Ghidra. Experience in unpacking custom packers, analyzing malware behavior, and reconstructing source code from assembly.</p><p class='mono text-accent'>Tools: IDA Pro, Ghidra, x64dbg, Radare2</p>"
    },
    sec: {
        title: "Security Research",
        content: "<p>Vulnerability research focusing on RCE, LPE, and memory corruption bugs. Active participant in bug bounty programs with confirmed CVEs in enterprise software.</p>"
    },
    low: {
        title: "Low Level Development",
        content: "<p>System level programming in C/C++ and Rust. Kernel drivers, internal game hacks (DLL injection), and custom memory allocators.</p>"
    },
    java: {
        title: "Java / Minecraft",
        content: "<p>Advanced modifications for Minecraft clients. Custom rendering engines, packet manipulation (Netty), and anti-cheat bypass techniques.</p>"
    },
    linux: {
        title: "Linux & Pentesting",
        content: "<p>Automated pentesting scripts, custom Kali Linux tools, and hardened server configurations. Experience with bash scripting and python automation.</p>"
    },
    game: {
        title: "Game Hacking",
        content: "<p>Internal and external cheat development. ESP, Aimbot logic, and memory reading/writing. Bypass methods for standard anti-cheats.</p>"
    }
};

window.openModal = function (id) {
    const data = modalData[id];
    if (!data) return;

    document.querySelector('#project-modal .modal-header span').innerText = `SECURE_CONNECTION: ${data.title}`;
    document.getElementById('modal-body').innerHTML = `
        ${data.content}
        <a href="#" class="modal-btn">Initiate Protocol</a>
    `;

    document.getElementById('project-modal').classList.add('active');
}

window.closeModal = function () {
    document.getElementById('project-modal').classList.remove('active');
}

// Close on outside click
document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') window.closeModal();
});

/* =========================================
   8. Hex Dump Decoration
   ========================================= */
const hexContent = document.getElementById('hex-content');

function generateHexLine() {
    const addr = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(8, '0').toUpperCase();
    let bytes = '';
    for (let i = 0; i < 8; i++) {
        bytes += Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    return `<div class="hex-row"><span style="color:#666">0x${addr}</span>  <span style="color:var(--accent)">${bytes}</span></div>`;
}

function updateHexDump() {
    if (!hexContent) return;
    hexContent.innerHTML += generateHexLine(); // Add new line

    // Maintain fixed size buffer
    while (hexContent.children.length > 20) {
        hexContent.removeChild(hexContent.firstChild);
    }
}

if (hexContent) {
    setInterval(updateHexDump, 200);
}


/* =========================================
   9. Themes & Secrets
   ========================================= */

// Theme Switcher
window.setTheme = function (theme) {
    document.body.className = ''; // Clear existing
    if (theme !== 'green') {
        document.body.classList.add(`theme-${theme}`);
    }
    drawParticles();
}


// Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateRootMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateRootMode() {
    alert("SYSTEM OVERRIDE: ROOT ACCESS GRANTED");
    setTheme('red');
    document.body.classList.add('root-unlocked');
    document.querySelector('.hero-title').innerText = "GOD_MODE";
    setTimeout(() => document.body.classList.remove('root-unlocked'), 1000);
}

// Secure Contact (Overwrite default link behavior)
const contactLink = document.querySelector('footer a[href="#"]:nth-child(3)');
if (contactLink) {
    contactLink.onclick = function (e) {
        e.preventDefault();
        openContactModal();
    };
}

function openContactModal() {
    document.querySelector('#project-modal .modal-header span').innerText = `ENCRYPTED_CHANNEL`;
    document.getElementById('modal-body').innerHTML = `
        <div class="input-group" style="display:flex; flex-direction:column; gap:10px;">
            <input type="text" placeholder="IDENTITY_Required" style="background:transparent; border:1px solid #333; color:var(--accent); padding:10px; font-family:var(--font-mono);">
            <textarea placeholder="TRANSMISSION_Content" rows="5" style="background:transparent; border:1px solid #333; color:var(--accent); padding:10px; font-family:var(--font-mono);"></textarea>
            <button class="modal-btn" onclick="simulateSend(this)">TRANSMIT</button>
        </div>
    `;
    document.getElementById('project-modal').classList.add('active');
}

window.simulateSend = function (btn) {
    const originalText = btn.innerText;
    btn.innerText = "ENCRYPTING...";
    let steps = 0;

    // Matrix effect text scramble
    const interval = setInterval(() => {
        btn.innerText = Math.random().toString(36).substring(7).toUpperCase();
        steps++;
        if (steps > 15) {
            clearInterval(interval);
            btn.innerText = "SENT_SECURELY";
            setTimeout(() => window.closeModal(), 1000);
        }
    }, 100);
}


/* =========================================
   10. System Optimizations
   ========================================= */

// Matrix Rain Toggle
let isMatrixEnabled = true;

function toggleMatrixRain() {
    isMatrixEnabled = !isMatrixEnabled;
    const canvas = document.getElementById('matrix-canvas');
    if (isMatrixEnabled) {
        canvas.style.opacity = '0.1';
        if (!matrixInterval) matrixInterval = setInterval(loop, 50);
    } else {
        canvas.style.opacity = '0';
        clearInterval(matrixInterval);
        matrixInterval = null;
    }
}
