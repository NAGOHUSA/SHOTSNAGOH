// NAGOH Shots - Main Application
// Canvas rendering and state management

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let state = {
    image: null,
    bgColor: '#fdf8f0',
    accentColor: '#e8524a',
    textColor: '#3d2f24',
    currentDevice: 'iphone-16-pro',
    caption: '',
    subtitle: '',
    fontSize: 24,
    fontFamily: 'Fraunces, serif',
    textPosition: 'top',
    padding: 40,
    showFrame: false,
    perspective: 0,
    hideStatusBar: false,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textStrike: false,
    bgStyle: 'solid',
    bgImage: null
};

// Emojis grid
function initializeEmojiGrid() {
    const grid = document.getElementById('emojiGrid');
    grid.innerHTML = '';
    COMMON_EMOJIS.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
            const textarea = document.getElementById('captionInput');
            textarea.value += emoji;
        });
        grid.appendChild(btn);
    });
}

// Initialize app
function initialize() {
    initializeDeviceGrid();
    initializePresetSelect();
    initializeEmojiGrid();
    
    // Event listeners
    setupEventListeners();
    
    // Load settings
    const settings = loadSettings();
    if (settings.device) state.currentDevice = settings.device;
    
    // Initial render
    selectDevice('iphone-16-pro');
}

function setupEventListeners() {
    // File uploads
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (e) => {
        loadImage(e.target.files[0]);
    });
    
    document.getElementById('bgUploadBtn').addEventListener('click', () => {
        document.getElementById('bgFileInput').click();
    });
    
    document.getElementById('bgFileInput').addEventListener('change', (e) => {
        loadBackgroundImage(e.target.files[0]);
    });
    
    // Drag and drop
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        if (e.dataTransfer.files.length) loadImage(e.dataTransfer.files[0]);
    });
    dropZone.addEventListener('click', () => document.getElementById('fileInput').click());
    
    // Color inputs
    document.getElementById('bgColor').addEventListener('change', (e) => {
        state.bgColor = e.target.value;
        redraw();
    });
    
    document.getElementById('accentColor').addEventListener('change', (e) => {
        state.accentColor = e.target.value;
    });
    
    document.getElementById('textColor').addEventListener('change', (e) => {
        state.textColor = e.target.value;
        redraw();
    });
    
    // Palette selection
    document.getElementById('paletteSelect').addEventListener('change', (e) => {
        if (e.target.value) {
            applyPalette(e.target.value);
            redraw();
        }
    });
    
    document.getElementById('savePaletteBtn').addEventListener('click', () => {
        const name = prompt('Palette name:');
        if (name) {
            const palette = {
                background: state.bgColor,
                primary: state.accentColor,
                text: state.textColor
            };
            saveUserPreset(name, palette);
            alert('Palette saved!');
        }
    });
    
    // Font
    document.getElementById('fontSelect').addEventListener('change', (e) => {
        state.fontFamily = e.target.value;
        redraw();
    });
    
    // Caption
    document.getElementById('captionInput').addEventListener('input', (e) => {
        state.caption = e.target.value;
        redraw();
    });
    
    // Subtitle
    document.getElementById('subtitleInput').addEventListener('input', (e) => {
        state.subtitle = e.target.value;
        redraw();
    });
    
    // Font size
    document.getElementById('fontSize').addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = e.target.value;
        redraw();
    });
    
    // Text formatting
    document.getElementById('boldBtn').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        state.fontWeight = e.target.classList.contains('active') ? 'bold' : 'normal';
        redraw();
    });
    
    document.getElementById('italicBtn').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        state.fontStyle = e.target.classList.contains('active') ? 'italic' : 'normal';
        redraw();
    });
    
    document.getElementById('underlineBtn').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        state.textDecoration = e.target.classList.contains('active') ? 'underline' : 'none';
        redraw();
    });
    
    document.getElementById('strikeBtn').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        state.textStrike = e.target.classList.contains('active');
        redraw();
    });
    
    // Position
    document.querySelectorAll('[data-position]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-position]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.textPosition = e.target.dataset.position;
            redraw();
        });
    });
    
    // Padding
    document.querySelectorAll('[data-padding]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-padding]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const paddings = { comfy: 40, tight: 20, xtight: 10 };
            state.padding = paddings[e.target.dataset.padding];
            redraw();
        });
    });
    
    // Frame toggle
    document.getElementById('frameToggle').addEventListener('change', (e) => {
        state.showFrame = e.target.checked;
        redraw();
    });
    
    // Perspective
    document.getElementById('perspectiveSlider').addEventListener('input', (e) => {
        state.perspective = parseInt(e.target.value);
        document.getElementById('perspectiveValue').textContent = e.target.value;
        redraw();
    });
    
    // Status bar
    document.getElementById('hideStatusBarToggle').addEventListener('change', (e) => {
        state.hideStatusBar = e.target.checked;
        redraw();
    });
    
    // Download
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    
    // Reset
    document.getElementById('resetBtn').addEventListener('click', resetApp);
    
    // Preset select
    document.getElementById('presetSelect').addEventListener('change', (e) => {
        if (e.target.value) {
            selectDevice(e.target.value);
        }
    });
}

function selectDevice(deviceKey) {
    state.currentDevice = deviceKey;
    
    document.querySelectorAll('[data-device]').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-device="${deviceKey}"]`);
    if (btn) btn.classList.add('active');
    
    const spec = DEVICE_SPECS[deviceKey];
    document.getElementById('selectedDims').textContent = `${spec.width} × ${spec.height}`;
    document.getElementById('selectedDevice').textContent = spec.name;
    
    saveSettings({ device: deviceKey });
    redraw();
}

function loadImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.image = img;
            document.getElementById('downloadBtn').disabled = false;
            redraw();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function loadBackgroundImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.bgImage = img;
            state.bgStyle = 'image';
            redraw();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function redraw() {
    const spec = DEVICE_SPECS[state.currentDevice];
    canvas.width = spec.width;
    canvas.height = spec.height;
    
    // Background
    if (state.bgStyle === 'image' && state.bgImage) {
        ctx.drawImage(state.bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = state.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw image
    if (state.image) {
        const imgAspect = state.image.width / state.image.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let displayWidth, displayHeight;
        if (imgAspect > canvasAspect) {
            displayWidth = canvas.width * 0.8;
            displayHeight = displayWidth / imgAspect;
        } else {
            displayHeight = canvas.height * 0.8;
            displayWidth = displayHeight * imgAspect;
        }
        
        const x = (canvas.width - displayWidth) / 2;
        const y = (canvas.height - displayHeight) / 2;
        
        if (state.showFrame) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x - 10, y - 10, displayWidth + 20, displayHeight + 20);
        }
        
        ctx.drawImage(state.image, x, y, displayWidth, displayHeight);
    }
    
    // Draw text
    drawText();
}

function drawText() {
    if (!state.caption) return;
    
    const y = getTextY();
    const fontStyle = state.fontStyle === 'italic' ? 'italic ' : '';
    const fontWeight = state.fontWeight === 'bold' ? 'bold ' : '';
    
    ctx.font = `${fontStyle}${fontWeight}${state.fontSize}px ${state.fontFamily}`;
    ctx.fillStyle = state.textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    
    // Draw text with wrapping
    const maxWidth = canvas.width - state.padding * 2;
    const words = state.caption.split(' ');
    let line = '';
    let currentY = y;
    
    words.forEach((word) => {
        const testLine = line + (line ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line) {
            drawTextLine(line, canvas.width / 2, currentY);
            line = word;
            currentY += state.fontSize + 10;
        } else {
            line = testLine;
        }
    });
    
    if (line) {
        drawTextLine(line, canvas.width / 2, currentY);
    }
}

function drawTextLine(text, x, y) {
    ctx.fillText(text, x, y);
    
    if (state.textDecoration === 'underline') {
        const metrics = ctx.measureText(text);
        ctx.strokeStyle = state.textColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - metrics.width / 2, y + state.fontSize + 5);
        ctx.lineTo(x + metrics.width / 2, y + state.fontSize + 5);
        ctx.stroke();
    }
    
    if (state.textStrike) {
        const metrics = ctx.measureText(text);
        ctx.strokeStyle = state.textColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - metrics.width / 2, y + state.fontSize / 2);
        ctx.lineTo(x + metrics.width / 2, y + state.fontSize / 2);
        ctx.stroke();
    }
}

function getTextY() {
    const padding = state.padding;
    switch (state.textPosition) {
        case 'top':
            return padding + state.fontSize + 20; // Extra padding to prevent cutoff
        case 'middle':
            return (canvas.height - state.fontSize) / 2;
        case 'bottom':
            return canvas.height - padding - state.fontSize - 20;
        default:
            return padding + state.fontSize + 20;
    }
}

function downloadImage() {
    const spec = DEVICE_SPECS[state.currentDevice];
    const filename = `${spec.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${spec.width}x${spec.height}-appstore.png`;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}

function resetApp() {
    state = {
        image: null,
        bgColor: '#fdf8f0',
        accentColor: '#e8524a',
        textColor: '#3d2f24',
        currentDevice: 'iphone-16-pro',
        caption: '',
        subtitle: '',
        fontSize: 24,
        fontFamily: 'Fraunces, serif',
        textPosition: 'top',
        padding: 40,
        showFrame: false,
        perspective: 0,
        hideStatusBar: false,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textStrike: false,
        bgStyle: 'solid',
        bgImage: null
    };
    
    document.getElementById('fileInput').value = '';
    document.getElementById('bgFileInput').value = '';
    document.getElementById('captionInput').value = '';
    document.getElementById('subtitleInput').value = '';
    document.getElementById('fontSelect').value = 'Fraunces, serif';
    document.getElementById('fontSize').value = 24;
    document.getElementById('fontSizeValue').textContent = '24';
    document.getElementById('bgColor').value = '#fdf8f0';
    document.getElementById('textColor').value = '#3d2f24';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('frameToggle').checked = false;
    document.getElementById('hideStatusBarToggle').checked = false;
    document.getElementById('perspectiveSlider').value = 0;
    document.getElementById('perspectiveValue').textContent = '0';
    
    selectDevice('iphone-16-pro');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize);
