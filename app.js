<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAGOH Shots - Advanced Screenshot Maker</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300;1,500&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --cream:    #fdf8f0;
            --warm:     #ede3d5;
            --border:   #e0d4c4;
            --muted:    #b5a090;
            --dim:      #8a7868;
            --sub:      #6b5e50;
            --ink:      #3d2f24;
            --deep:     #2a1f16;
            --rose:     #e8524a;
            --rose-lt:  #fce8e7;
            --teal:     #2a9d8f;
            --teal-lt:  #e0f5f3;
            --gold:     #e9a028;
            --gold-lt:  #fdf0d5;
            --sage:     #4a7c59;
            --sage-lt:  #e8f4eb;
            --sans:     'DM Sans', sans-serif;
            --serif:    'Fraunces', serif;
        }
        
        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
            background: var(--cream);
            color: var(--ink);
            font-family: var(--sans);
        }
        
        body { display: flex; flex-direction: column; }
        
        .topbar {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            gap: 1rem;
            background: var(--deep);
            flex-shrink: 0;
            border-bottom: 3px solid var(--rose);
        }
        
        .wordmark { font-family: var(--serif); font-size: 1.4rem; font-weight: 700; color: #fff; }
        .wordmark em { color: var(--gold); font-style: italic; }
        .tagline { font-size: 0.65rem; color: rgba(255,255,255,0.45); }
        .tsep { flex: 1; }
        .tpill { display: flex; align-items: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 4px 12px; font-size: 0.7rem; color: rgba(255,255,255,0.65); }
        .tbtn { font-family: var(--sans); font-size: 0.68rem; font-weight: 500; padding: 6px 14px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.65); cursor: pointer; border-radius: 6px; transition: all 0.15s; }
        .tbtn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        
        .main {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 1.5rem;
            padding: 1.5rem;
            overflow: hidden;
        }
        
        .canvas-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            min-height: 0;
        }
        
        .canvas-wrapper {
            flex: 1;
            background: white;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            min-height: 0;
            position: relative;
            cursor: crosshair;
        }
        
        #canvasContainer {
            position: relative;
            display: inline-block;
        }
        
        canvas {
            max-width: 100%;
            max-height: 100%;
            display: block;
        }
        
        .text-label {
            position: absolute;
            cursor: move;
            padding: 4px 8px;
            background: rgba(0,0,0,0.05);
            border: 1px dashed var(--rose);
            border-radius: 4px;
            font-size: 0.7rem;
            color: var(--rose);
            white-space: nowrap;
            user-select: none;
            z-index: 10;
        }
        
        .text-label:hover {
            background: rgba(232, 82, 74, 0.1);
        }
        
        .text-label.active {
            background: var(--rose-lt);
            border-color: var(--rose);
            box-shadow: 0 0 8px rgba(232, 82, 74, 0.3);
        }
        
        .controls {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }
        
        .btn {
            font-family: var(--sans);
            font-size: 0.8rem;
            font-weight: 500;
            padding: 9px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.15s;
        }
        
        .btn-primary { background: var(--teal); color: white; }
        .btn-primary:hover { background: #1f8a7a; }
        .btn-secondary { background: var(--warm); color: var(--ink); border: 1px solid var(--border); }
        .btn-secondary:hover { background: var(--parchmt); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow-y: auto;
            padding-right: 0.5rem;
        }
        
        .panel {
            background: white;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1.2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            flex-shrink: 0;
        }
        
        .panel-title {
            font-family: var(--serif);
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--ink);
            margin-bottom: 1rem;
        }
        
        .form-group { margin-bottom: 1rem; }
        .form-group:last-child { margin-bottom: 0; }
        
        label {
            display: block;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--sub);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-family: var(--sans);
            font-size: 0.8rem;
            color: var(--ink);
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--rose);
            box-shadow: 0 0 0 3px var(--rose-lt);
        }
        
        textarea { resize: vertical; min-height: 70px; }
        
        .color-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            margin-top: 0.5rem;
        }
        
        .template-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            margin-top: 0.5rem;
        }
        
        .template-btn {
            padding: 12px 8px;
            border: 2px solid var(--border);
            border-radius: 6px;
            background: white;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .template-btn:hover {
            border-color: var(--rose);
            background: var(--rose-lt);
        }
        
        .template-btn.active {
            border-color: var(--teal);
            background: var(--teal-lt);
            color: var(--teal);
        }
        
        .font-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            margin-top: 0.5rem;
        }
        
        .font-option {
            padding: 8px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: white;
            cursor: pointer;
            text-align: center;
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.15s;
        }
        
        .font-option:hover {
            border-color: var(--gold);
            background: var(--gold-lt);
        }
        
        .font-option.active {
            border-color: var(--gold);
            background: var(--gold);
            color: white;
        }
        
        .position-grid, .text-controls {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.6rem;
            margin-top: 0.5rem;
        }
        
        .text-controls {
            grid-template-columns: repeat(4, 1fr);
        }
        
        .btn-small {
            padding: 8px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: white;
            cursor: pointer;
            font-size: 0.8rem;
            text-align: center;
            transition: all 0.15s;
            font-weight: 500;
        }
        
        .btn-small:hover {
            border-color: var(--rose);
            background: var(--rose-lt);
        }
        
        .btn-small.active {
            border-color: var(--teal);
            background: var(--teal-lt);
            color: var(--teal);
        }
        
        .emoji-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.4rem;
            margin-top: 0.5rem;
        }
        
        .emoji-btn {
            padding: 6px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: white;
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .drop-zone {
            border: 2px dashed var(--border);
            border-radius: 8px;
            padding: 1.2rem;
            text-align: center;
            cursor: pointer;
            background: var(--rose-lt);
            margin-top: 0.5rem;
            transition: all 0.2s;
        }
        
        .drop-zone:hover { border-color: var(--rose); }
        
        .info-text {
            font-size: 0.7rem;
            color: var(--muted);
            margin-top: 0.5rem;
            font-style: italic;
        }
        
        input[type="range"] {
            width: 100%;
            margin-top: 0.5rem;
        }
        
        @media (max-width: 1024px) {
            .main { grid-template-columns: 1fr; }
            .sidebar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-height: 350px; }
        }
        
        @media (max-width: 768px) {
            .topbar { padding: 0 1rem; }
            .main { padding: 1rem; grid-template-columns: 1fr; }
            .sidebar { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="topbar">
        <div class="wordmark">NAGOH <em>Shots</em></div>
        <div class="tagline">Advanced Screenshot Maker</div>
        <div class="tsep"></div>
        <div class="tpill">✓ Drag-to-Position</div>
        <button class="tbtn" id="downloadBtn" disabled>Download PNG</button>
    </div>

    <div class="main">
        <div class="canvas-section">
            <div class="canvas-wrapper">
                <div id="canvasContainer">
                    <canvas id="canvas"></canvas>
                    <div id="textOverlays"></div>
                </div>
            </div>
            <div class="controls">
                <button class="btn btn-primary" id="uploadBtn">Upload Image</button>
                <button class="btn btn-secondary" id="resetBtn">Reset</button>
            </div>
        </div>

        <div class="sidebar">
            <!-- Templates -->
            <div class="panel">
                <label class="panel-title">Templates</label>
                <div class="template-grid">
                    <button class="template-btn active" data-template="minimal">Minimal</button>
                    <button class="template-btn" data-template="vibrant">Vibrant</button>
                    <button class="template-btn" data-template="elegant">Elegant</button>
                    <button class="template-btn" data-template="modern">Modern</button>
                    <button class="template-btn" data-template="warm">Warm</button>
                    <button class="template-btn" data-template="cool">Cool</button>
                </div>
                <p class="info-text">👆 Tap to apply preset style</p>
            </div>

            <!-- Devices -->
            <div class="panel">
                <label class="panel-title">Device</label>
                <select id="deviceSelect">
                    <option value="iphone-16-pro">iPhone 16 Pro (1290×2796)</option>
                    <option value="iphone-16-pro-max">iPhone 16 Pro Max (1320×2868)</option>
                    <option value="iphone-15">iPhone 15 (1170×2532)</option>
                    <option value="iphone-15-plus">iPhone 15 Plus (1290×2796)</option>
                    <option value="ipad-pro-13">iPad Pro 13" (2064×2752)</option>
                    <option value="ipad-pro-12.9">iPad Pro 12.9" (2048×2732)</option>
                </select>
            </div>

            <!-- Colors -->
            <div class="panel">
                <label class="panel-title">Colors</label>
                <div class="color-row">
                    <div class="form-group">
                        <label>Background</label>
                        <input type="color" id="bgColor" value="#fdf8f0">
                    </div>
                    <div class="form-group">
                        <label>Text</label>
                        <input type="color" id="textColor" value="#3d2f24">
                    </div>
                </div>
            </div>

            <!-- Fonts -->
            <div class="panel">
                <label class="panel-title">Font</label>
                <div class="font-grid">
                    <button class="font-option active" data-font="Fraunces, serif" style="font-family: Fraunces, serif;">Fraunces</button>
                    <button class="font-option" data-font="Playfair Display, serif" style="font-family: Playfair Display, serif;">Playfair</button>
                    <button class="font-option" data-font="DM Sans, sans-serif" style="font-family: DM Sans, sans-serif;">DM Sans</button>
                    <button class="font-option" data-font="Inter, sans-serif" style="font-family: Inter, sans-serif;">Inter</button>
                    <button class="font-option" data-font="Poppins, sans-serif" style="font-family: Poppins, sans-serif;">Poppins</button>
                    <button class="font-option" data-font="Georgia, serif" style="font-family: Georgia, serif;">Georgia</button>
                </div>
            </div>

            <!-- Image -->
            <div class="panel">
                <label class="panel-title">Image</label>
                <div class="drop-zone" id="dropZone">Drop image here</div>
            </div>

            <!-- Caption -->
            <div class="panel">
                <label class="panel-title">Caption</label>
                <textarea id="captionInput" placeholder="Add text..."></textarea>
                <div class="text-controls">
                    <button class="btn-small" id="boldBtn">B</button>
                    <button class="btn-small" id="italicBtn">I</button>
                    <button class="btn-small" id="underlineBtn">U</button>
                    <button class="btn-small" id="strikeBtn">S</button>
                </div>
                <label style="margin-top: 1rem;">Size</label>
                <input type="range" id="fontSize" min="12" max="80" value="32">
            </div>

            <!-- Position -->
            <div class="panel">
                <label class="panel-title">Position</label>
                <div class="position-grid">
                    <button class="btn-small active" data-position="top">Top</button>
                    <button class="btn-small" data-position="middle">Middle</button>
                    <button class="btn-small" data-position="bottom">Bottom</button>
                </div>
                <p class="info-text">💡 Or drag text on canvas</p>
            </div>

            <!-- Emojis -->
            <div class="panel">
                <label class="panel-title">Emojis</label>
                <div class="emoji-grid" id="emojiGrid"></div>
            </div>
        </div>
    </div>

    <input type="file" id="fileInput" accept="image/*" style="display: none;">

    <script>
        // Templates with preset styles
        const TEMPLATES = {
            minimal: {
                name: 'Minimal',
                bgColor: '#ffffff',
                textColor: '#000000',
                fontFamily: 'Inter, sans-serif',
                fontSize: 28
            },
            vibrant: {
                name: 'Vibrant',
                bgColor: '#2a9d8f',
                textColor: '#ffffff',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 36
            },
            elegant: {
                name: 'Elegant',
                bgColor: '#f5ede0',
                textColor: '#2a1f16',
                fontFamily: 'Playfair Display, serif',
                fontSize: 40
            },
            modern: {
                name: 'Modern',
                bgColor: '#3d2f24',
                textColor: '#e9a028',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 32
            },
            warm: {
                name: 'Warm',
                bgColor: '#fdf8f0',
                textColor: '#e8524a',
                fontFamily: 'Fraunces, serif',
                fontSize: 34
            },
            cool: {
                name: 'Cool',
                bgColor: '#e0f5f3',
                textColor: '#0066cc',
                fontFamily: 'Inter, sans-serif',
                fontSize: 30
            }
        };

        const DEVICE_SPECS = {
            'iphone-16-pro': { name: 'iPhone 16 Pro', width: 1290, height: 2796 },
            'iphone-16-pro-max': { name: 'iPhone 16 Pro Max', width: 1320, height: 2868 },
            'iphone-15': { name: 'iPhone 15', width: 1170, height: 2532 },
            'iphone-15-plus': { name: 'iPhone 15 Plus', width: 1290, height: 2796 },
            'ipad-pro-13': { name: 'iPad Pro 13"', width: 2064, height: 2752 },
            'ipad-pro-12.9': { name: 'iPad Pro 12.9"', width: 2048, height: 2732 }
        };

        const EMOJIS = ['👍', '👏', '🎉', '✨', '🚀', '💡', '🔥', '⭐', '💎', '🎯', '📱', '💻', '⚙️', '🛠️', '✅', '❌', '❤️', '😀', '👀', '🌟', '💪', '📈', '🎨', '🔐', '🌍', '📚', '🏆'];

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let canvasRect = canvas.getBoundingClientRect();

        let state = {
            image: null,
            bgColor: '#fdf8f0',
            textColor: '#3d2f24',
            caption: '',
            fontSize: 32,
            fontFamily: 'Fraunces, serif',
            currentDevice: 'iphone-16-pro',
            textPosition: 'top',
            textX: null,
            textY: null,
            fontWeight: 'normal',
            fontStyle: 'normal',
            activeTemplate: 'minimal'
        };

        let draggingText = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        // Initialize
        function init() {
            initEmojis();
            setupEventListeners();
            selectDevice('iphone-16-pro');
        }

        function initEmojis() {
            const grid = document.getElementById('emojiGrid');
            EMOJIS.forEach(emoji => {
                const btn = document.createElement('button');
                btn.className = 'emoji-btn';
                btn.textContent = emoji;
                btn.style.border = '1px solid var(--border)';
                btn.style.background = 'white';
                btn.onclick = () => {
                    document.getElementById('captionInput').value += emoji;
                    state.caption += emoji;
                    redraw();
                };
                grid.appendChild(btn);
            });
        }

        function setupEventListeners() {
            // Templates
            document.querySelectorAll('[data-template]').forEach(btn => {
                btn.onclick = (e) => {
                    document.querySelectorAll('[data-template]').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    const template = TEMPLATES[e.target.dataset.template];
                    Object.assign(state, template);
                    document.getElementById('bgColor').value = template.bgColor;
                    document.getElementById('textColor').value = template.textColor;
                    document.getElementById('fontSize').value = template.fontSize;
                    applyFontButton(template.fontFamily);
                    redraw();
                };
            });

            // Fonts
            document.querySelectorAll('[data-font]').forEach(btn => {
                btn.onclick = (e) => {
                    applyFontButton(e.target.dataset.font);
                };
            });

            // Devices
            document.getElementById('deviceSelect').onchange = (e) => {
                selectDevice(e.target.value);
            };

            // Colors
            document.getElementById('bgColor').onchange = (e) => {
                state.bgColor = e.target.value;
                redraw();
            };

            document.getElementById('textColor').onchange = (e) => {
                state.textColor = e.target.value;
                redraw();
            };

            // Image
            document.getElementById('uploadBtn').onclick = () => document.getElementById('fileInput').click();
            document.getElementById('fileInput').onchange = (e) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        state.image = img;
                        document.getElementById('downloadBtn').disabled = false;
                        redraw();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            };

            // Drag & drop
            const dropZone = document.getElementById('dropZone');
            dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.opacity = '0.5'; };
            dropZone.ondragleave = () => { dropZone.style.opacity = '1'; };
            dropZone.ondrop = (e) => {
                e.preventDefault();
                dropZone.style.opacity = '1';
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            state.image = img;
                            document.getElementById('downloadBtn').disabled = false;
                            redraw();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            dropZone.onclick = () => document.getElementById('fileInput').click();

            // Caption
            document.getElementById('captionInput').oninput = (e) => {
                state.caption = e.target.value;
                redraw();
            };

            // Font size
            document.getElementById('fontSize').oninput = (e) => {
                state.fontSize = parseInt(e.target.value);
                redraw();
            };

            // Text formatting
            document.getElementById('boldBtn').onclick = (e) => {
                e.target.classList.toggle('active');
                state.fontWeight = e.target.classList.contains('active') ? 'bold' : 'normal';
                redraw();
            };

            document.getElementById('italicBtn').onclick = (e) => {
                e.target.classList.toggle('active');
                state.fontStyle = e.target.classList.contains('active') ? 'italic' : 'normal';
                redraw();
            };

            // Position
            document.querySelectorAll('[data-position]').forEach(btn => {
                btn.onclick = (e) => {
                    document.querySelectorAll('[data-position]').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    state.textPosition = e.target.dataset.position;
                    state.textX = null;
                    state.textY = null;
                    redraw();
                };
            });

            // Canvas interaction for dragging
            const container = document.getElementById('canvasContainer');
            container.onmousedown = startDrag;
            document.onmousemove = moveDrag;
            document.onmouseup = endDrag;

            document.getElementById('resetBtn').onclick = () => {
                state = {
                    image: null,
                    bgColor: '#fdf8f0',
                    textColor: '#3d2f24',
                    caption: '',
                    fontSize: 32,
                    fontFamily: 'Fraunces, serif',
                    currentDevice: 'iphone-16-pro',
                    textPosition: 'top',
                    textX: null,
                    textY: null,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    activeTemplate: 'minimal'
                };
                document.getElementById('fileInput').value = '';
                document.getElementById('captionInput').value = '';
                document.getElementById('fontSize').value = '32';
                document.getElementById('bgColor').value = '#fdf8f0';
                document.getElementById('textColor').value = '#3d2f24';
                document.getElementById('downloadBtn').disabled = true;
                selectDevice('iphone-16-pro');
            };

            document.getElementById('downloadBtn').onclick = () => {
                const spec = DEVICE_SPECS[state.currentDevice];
                const filename = `${spec.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${spec.width}x${spec.height}-appstore.png`;
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = filename;
                link.click();
            };
        }

        function applyFontButton(fontFamily) {
            document.querySelectorAll('[data-font]').forEach(b => b.classList.remove('active'));
            document.querySelector(`[data-font="${fontFamily}"]`).classList.add('active');
            state.fontFamily = fontFamily;
            redraw();
        }

        function selectDevice(deviceKey) {
            state.currentDevice = deviceKey;
            document.getElementById('deviceSelect').value = deviceKey;
            redraw();
        }

        function startDrag(e) {
            const overlays = document.getElementById('textOverlays');
            const label = overlays.querySelector('.text-label');
            if (label && label.contains(e.target)) {
                draggingText = true;
                dragOffsetX = e.clientX - label.offsetLeft;
                dragOffsetY = e.clientY - label.offsetTop;
                label.classList.add('active');
            }
        }

        function moveDrag(e) {
            if (!draggingText) return;
            
            const overlays = document.getElementById('textOverlays');
            const label = overlays.querySelector('.text-label');
            const container = document.getElementById('canvasContainer');
            const rect = container.getBoundingClientRect();
            
            let x = e.clientX - rect.left - dragOffsetX;
            let y = e.clientY - rect.top - dragOffsetY;
            
            // Convert screen coords to canvas coords
            const scaleX = canvas.width / canvas.offsetWidth;
            const scaleY = canvas.height / canvas.offsetHeight;
            
            state.textX = x * scaleX;
            state.textY = y * scaleY;
            
            redraw();
        }

        function endDrag() {
            draggingText = false;
            const overlays = document.getElementById('textOverlays');
            const label = overlays.querySelector('.text-label');
            if (label) label.classList.remove('active');
        }

        function redraw() {
            const spec = DEVICE_SPECS[state.currentDevice];
            canvas.width = spec.width;
            canvas.height = spec.height;
            canvasRect = canvas.getBoundingClientRect();

            // Background
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Image
            if (state.image) {
                const imgAspect = state.image.width / state.image.height;
                const canvasAspect = canvas.width / canvas.height;
                let displayWidth, displayHeight;
                if (imgAspect > canvasAspect) {
                    displayWidth = canvas.width * 0.85;
                    displayHeight = displayWidth / imgAspect;
                } else {
                    displayHeight = canvas.height * 0.85;
                    displayWidth = displayHeight * imgAspect;
                }
                const x = (canvas.width - displayWidth) / 2;
                const y = (canvas.height - displayHeight) / 2;
                ctx.drawImage(state.image, x, y, displayWidth, displayHeight);
            }

            // Text
            if (state.caption) {
                const fontWeight = state.fontWeight === 'bold' ? 'bold ' : '';
                const fontStyle = state.fontStyle === 'italic' ? 'italic ' : '';
                ctx.font = `${fontStyle}${fontWeight}${state.fontSize}px ${state.fontFamily}`;
                ctx.fillStyle = state.textColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                let textX = canvas.width / 2;
                let textY;

                if (state.textX !== null && state.textY !== null) {
                    textX = state.textX;
                    textY = state.textY;
                } else {
                    if (state.textPosition === 'top') {
                        textY = state.fontSize + 40;
                    } else if (state.textPosition === 'middle') {
                        ctx.textBaseline = 'middle';
                        textY = canvas.height / 2;
                    } else {
                        ctx.textBaseline = 'bottom';
                        textY = canvas.height - state.fontSize - 40;
                    }
                }

                const maxWidth = canvas.width - 80;
                const words = state.caption.split(' ');
                let line = '';
                let currentY = textY;

                words.forEach((word) => {
                    const testLine = line + (line ? ' ' : '') + word;
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > maxWidth && line) {
                        ctx.fillText(line, textX, currentY);
                        line = word;
                        currentY += state.fontSize + 15;
                    } else {
                        line = testLine;
                    }
                });
                if (line) {
                    ctx.fillText(line, textX, currentY);
                }

                // Update overlay label for dragging
                updateTextOverlay(textX, textY);
            }
        }

        function updateTextOverlay(x, y) {
            const container = document.getElementById('canvasContainer');
            const overlays = document.getElementById('textOverlays');
            
            // Convert canvas coords to screen coords
            const scaleX = canvas.offsetWidth / canvas.width;
            const scaleY = canvas.offsetHeight / canvas.height;
            
            let label = overlays.querySelector('.text-label');
            if (!label) {
                label = document.createElement('div');
                label.className = 'text-label';
                overlays.appendChild(label);
            }
            
            label.style.left = (x * scaleX - 20) + 'px';
            label.style.top = (y * scaleY - 25) + 'px';
            label.textContent = '↔ Drag me';
        }

        init();
    </script>
</body>
</html>
