{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Voice Assistant - ARIA</title>
    <meta name="csrf-token" content="{{ csrf_token }}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            height: 100vh;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #threejs-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .ui-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            pointer-events: none;
        }

        .control-panel {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            pointer-events: auto;
        }

        .control-btn {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(20px);
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .control-btn:active {
            transform: scale(0.95);
        }

        .control-btn.active {
            background: rgba(255, 50, 50, 0.7);
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .status-panel {
            position: absolute;
            top: 30px;
            left: 30px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            padding: 25px;
            border-radius: 15px;
            color: white;
            max-width: 450px;
            pointer-events: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-panel h2 {
            margin-bottom: 15px;
            color: #4CAF50;
            font-size: 1.5em;
        }

        .command-display {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            min-height: 50px;
            font-family: 'Courier New', monospace;
            border-left: 4px solid #4CAF50;
        }

        .response-display {
            background: rgba(100, 200, 255, 0.2);
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            min-height: 50px;
            border-left: 4px solid #2196F3;
        }

        .wave-indicator {
            position: absolute;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 50px;
            display: none;
            pointer-events: none;
        }

        .wave-indicator.active {
            display: block;
        }

        .wave-bar {
            width: 4px;
            height: 20px;
            background: #4CAF50;
            margin: 0 2px;
            border-radius: 2px;
            display: inline-block;
            animation: wave 1s infinite ease-in-out;
        }

        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }

        @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1.0); }
        }

        .assistant-name {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4em;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
            z-index: 5;
            animation: float 3s ease-in-out infinite;
            letter-spacing: 0.1em;
        }

        @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-20px); }
        }

        .settings-panel {
            position: absolute;
            top: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            padding: 25px;
            border-radius: 15px;
            color: white;
            pointer-events: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .settings-panel h3 {
            margin-bottom: 15px;
            color: #FF9800;
        }

        .settings-panel input, .settings-panel select {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            padding: 10px;
            color: white;
            width: 100%;
            margin: 8px 0;
        }

        .settings-panel input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .settings-panel label {
            display: block;
            margin-top: 15px;
            font-size: 14px;
            font-weight: 500;
        }

        .demo-btn {
            position: absolute;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            pointer-events: auto;
        }

        .instructions {
            position: absolute;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            padding: 20px;
            border-radius: 15px;
            color: white;
            max-width: 300px;
            font-size: 14px;
            pointer-events: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .instructions h4 {
            color: #FFC107;
            margin-bottom: 10px;
        }

        .instructions ul {
            list-style: none;
            padding: 0;
        }

        .instructions li {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }

        .instructions li:before {
            content: "▶";
            position: absolute;
            left: 0;
            color: #4CAF50;
        }

        .connection-status {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            pointer-events: none;
        }

        .connection-status.disconnected {
            background: rgba(244, 67, 54, 0.9);
        }

        @media (max-width: 768px) {
            .status-panel, .settings-panel {
                position: relative;
                margin: 10px;
                max-width: none;
            }
            
            .assistant-name {
                font-size: 2.5em;
            }
            
            .control-btn {
                width: 60px;
                height: 60px;
                font-size: 20px;
            }
            
            .instructions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="threejs-container"></div>
        
        <div class="ui-overlay">
            <div class="connection-status" id="connection-status">
                Connected
            </div>
            
            <div class="assistant-name">ARIA</div>
            
            <div class="status-panel">
                <h2>🎤 Voice Assistant</h2>
                <div class="command-display" id="command-display">
                    Ready to listen... Press Space or click the microphone to start.
                </div>
                <div class="response-display" id="response-display">
                    Hello! I'm ARIA, your 3D voice assistant. I can help you with time, weather, searches, and more!
                </div>
            </div>

            <div class="settings-panel">
                <h3>⚙️ Settings</h3>
                <label>Voice Speed:</label>
                <input type="range" id="voice-speed" min="50" max="200" value="100">
                <span id="speed-value">100%</span>
                
                <label>Voice Volume:</label>
                <input type="range" id="voice-volume" min="0" max="1" step="0.1" value="0.8">
                <span id="volume-value">80%</span>
                
                <label>Language:</label>
                <select id="language">
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="it-IT">Italian</option>
                    <option value="pt-BR">Portuguese</option>
                    <option value="ru-RU">Russian</option>
                    <option value="ja-JP">Japanese</option>
                    <option value="ko-KR">Korean</option>
                </select>
            </div>

            <div class="instructions">
                <h4>💡 Instructions</h4>
                <ul>
                    <li>Space: Start/Stop listening</li>
                    <li>Escape: Stop all actions</li>
                    <li>Try: "What time is it?"</li>
                    <li>Try: "Search for Python"</li>
                    <li>Try: "Open YouTube"</li>
                    <li>Try: "Tell me about AI"</li>
                </ul>
            </div>

            <div class="wave-indicator" id="wave-indicator">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
            </div>

            <div class="control-panel">
                <button class="control-btn" id="mic-btn" title="Start/Stop Listening (Space)">
                    🎤
                </button>
                <button class="control-btn" id="speak-btn" title="Repeat Last Response">
                    🔊
                </button>
                <button class="control-btn demo-btn" id="demo-btn" title="Demo Mode">
                    🎮
                </button>
                <button class="control-btn" id="stop-btn" title="Stop All (Escape)">
                    ⏹️
                </button>
            </div>
        </div>
    </div>

    <!-- Three.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <script>
        // Get CSRF token for Django
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        const csrftoken = getCookie('csrftoken') || document.querySelector('[name=csrf-token]').getAttribute('content');

        // 3D Scene Setup
        let scene, camera, renderer, assistant3D, particleSystem;
        let isListening = false;
        let isSpeaking = false;
        let recognition;
        let synthesis = window.speechSynthesis;
        let lastResponse = '';

        function init3D() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            document.getElementById('threejs-container').appendChild(renderer.domElement);

            // Create 3D Assistant Character
            createAssistant();

            // Enhanced Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            // Add point lights for more dynamic lighting
            const pointLight1 = new THREE.PointLight(0x00ff00, 1, 100);
            pointLight1.position.set(5, 5, 5);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x0077ff, 0.8, 100);
            pointLight2.position.set(-5, -5, 5);
            scene.add(pointLight2);

            // Camera position
            camera.position.z = 8;
            camera.position.y = 2;

            // Start animation loop
            animate();
        }

        function createAssistant() {
            const group = new THREE.Group();

            // Main body (more complex geometry)
            const bodyGeometry = new THREE.IcosahedronGeometry(1.2, 2);
            const bodyMaterial = new THREE.MeshPhongMaterial({
                color: 0x4CAF50,
                transparent: true,
                opacity: 0.8,
                shininess: 100,
                wireframe: false
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;
            group.add(body);

            // Inner core with pulsing effect
            const coreGeometry = new THREE.SphereGeometry(0.4, 16, 16);
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.9
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            group.add(core);

            // Multiple orbital rings with different sizes and rotations
            const ringConfigs = [
                { radius: 2, tube: 0.03, color: 0x00ffff, speed: 0.01 },
                { radius: 2.5, tube: 0.02, color: 0xff00ff, speed: -0.015 },
                { radius: 3, tube: 0.025, color: 0xffff00, speed: 0.008 }
            ];

            ringConfigs.forEach((config, i) => {
                const ringGeometry = new THREE.TorusGeometry(config.radius, config.tube, 8, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: config.color,
                    transparent: true,
                    opacity: 0.6
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                ring.rotation.z = i * Math.PI / 4;
                ring.userData = { speed: config.speed };
                group.add(ring);
            });

            // Enhanced particle system
            const particleCount = 200;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
                
                colors[i * 3] = Math.random();
                colors[i * 3 + 1] = Math.random();
                colors[i * 3 + 2] = Math.random();
                
                sizes[i] = Math.random() * 0.5 + 0.1;
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const particleMaterial = new THREE.PointsMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });
            
            particleSystem = new THREE.Points(particles, particleMaterial);
            group.add(particleSystem);

            assistant3D = group;
            scene.add(assistant3D);
        }

        function animate() {
            requestAnimationFrame(animate);

            if (assistant3D) {
                // Base rotation
                assistant3D.rotation.y += 0.005;
                
                // State-based animations
                if (isListening) {
                    const scale = 1 + Math.sin(Date.now() * 0.01) * 0.15;
                    assistant3D.scale.setScalar(scale);
                    assistant3D.children[1].material.color.setHex(0xff0000); // Red core
                    assistant3D.children[1].material.color.setHex(0xff0000); // Red core
                    assistant3D.rotation.x += 0.02;
                } else if (isSpeaking) {
                    const scale = 1 + Math.sin(Date.now() * 0.015) * 0.2;
                    assistant3D.scale.setScalar(scale);
                    assistant3D.children[1].material.color.setHex(0x00ff00); // Green core
                    assistant3D.rotation.z += 0.01;
                } else {
                    // Idle state
                    const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
                    assistant3D.scale.setScalar(scale);
                    assistant3D.children[1].material.color.setHex(0x4CAF50); // Default green
                }

                // Animate orbital rings
                assistant3D.children.forEach((child, i) => {
                    if (child.userData && child.userData.speed) {
                        child.rotation.z += child.userData.speed;
                    }
                });

                // Animate particles
                if (particleSystem) {
                    const positions = particleSystem.geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
                    }
                    particleSystem.geometry.attributes.position.needsUpdate = true;
                    particleSystem.rotation.y += 0.002;
                }
            }

            renderer.render(scene, camera);
        }

        // Speech Recognition Setup
        function initSpeechRecognition() {
            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
            } else if ('SpeechRecognition' in window) {
                recognition = new SpeechRecognition();
            } else {
                alert('Speech recognition not supported in this browser.');
                return;
            }

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = document.getElementById('language').value;

            recognition.onstart = function() {
                isListening = true;
                document.getElementById('mic-btn').classList.add('active');
                document.getElementById('wave-indicator').classList.add('active');
                document.getElementById('command-display').textContent = 'Listening...';
                updateConnectionStatus('Listening', 'listening');
            };

            recognition.onresult = function(event) {
                const command = event.results[0][0].transcript;
                document.getElementById('command-display').textContent = command;
                processCommand(command);
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                document.getElementById('command-display').textContent = 'Error: ' + event.error;
                stopListening();
            };

            recognition.onend = function() {
                stopListening();
            };
        }

        function startListening() {
            if (recognition && !isListening) {
                try {
                    recognition.lang = document.getElementById('language').value;
                    recognition.start();
                } catch (error) {
                    console.error('Error starting recognition:', error);
                }
            }
        }

        function stopListening() {
            isListening = false;
            document.getElementById('mic-btn').classList.remove('active');
            document.getElementById('wave-indicator').classList.remove('active');
            updateConnectionStatus('Connected', 'connected');
            if (recognition) {
                recognition.stop();
            }
        }

        // Command Processing
        async function processCommand(command) {
            const lowerCommand = command.toLowerCase();
            let response = '';

            try {
                // Time queries
                if (lowerCommand.includes('time')) {
                    const now = new Date();
                    response = `The current time is ${now.toLocaleTimeString()}`;
                }
                // Date queries
                else if (lowerCommand.includes('date')) {
                    const now = new Date();
                    response = `Today is ${now.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}`;
                }
                // Weather queries (mock response)
                else if (lowerCommand.includes('weather')) {
                    response = 'I cannot access real-time weather data, but you can check your local weather service for current conditions.';
                }
                // Search queries
                else if (lowerCommand.includes('search')) {
                    const searchTerm = lowerCommand.replace(/search for|search/gi, '').trim();
                    if (searchTerm) {
                        response = `I would search for "${searchTerm}" for you. Opening search results...`;
                        // In a real implementation, you would open a search page
                        setTimeout(() => {
                            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
                        }, 2000);
                    } else {
                        response = 'What would you like me to search for?';
                    }
                }
                // Open websites
                else if (lowerCommand.includes('open youtube')) {
                    response = 'Opening YouTube...';
                    setTimeout(() => window.open('https://youtube.com', '_blank'), 2000);
                }
                else if (lowerCommand.includes('open google')) {
                    response = 'Opening Google...';
                    setTimeout(() => window.open('https://google.com', '_blank'), 2000);
                }
                // AI and technology questions
                else if (lowerCommand.includes('ai') || lowerCommand.includes('artificial intelligence')) {
                    response = 'Artificial Intelligence is a branch of computer science focused on creating systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, and problem-solving.';
                }
                // Calculator
                else if (lowerCommand.includes('calculate') || lowerCommand.includes('what is') && (lowerCommand.includes('+') || lowerCommand.includes('-') || lowerCommand.includes('*') || lowerCommand.includes('/'))) {
                    try {
                        const mathExpression = lowerCommand.replace(/calculate|what is/gi, '').trim();
                        const result = eval(mathExpression.replace(/x/g, '*'));
                        response = `The answer is ${result}`;
                    } catch (error) {
                        response = 'I couldn\'t calculate that. Please try a simpler math expression.';
                    }
                }
                // Help
                else if (lowerCommand.includes('help')) {
                    response = 'I can help you with time, date, weather, searches, opening websites, basic calculations, and answering questions about AI and technology. Just speak naturally!';
                }
                // Greetings
                else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
                    response = 'Hello! I\'m ARIA, your 3D voice assistant. How can I help you today?';
                }
                // Default response
                else {
                    response = await getAIResponse(command);
                }

            } catch (error) {
                console.error('Error processing command:', error);
                response = 'I encountered an error processing your request. Please try again.';
            }

            document.getElementById('response-display').textContent = response;
            lastResponse = response;
            speak(response);
        }

        // AI Response (mock implementation)
        async function getAIResponse(command) {
            // In a real implementation, this would connect to an AI service
            const responses = [
                "That's an interesting question. Let me think about that for you.",
                "I understand what you're asking. Here's what I can tell you about that topic.",
                "That's a great question! Based on my knowledge, I can share some insights.",
                "I'm processing your request. Here's what I found.",
                "Thank you for asking. Let me provide you with some information about that."
            ];
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return responses[Math.floor(Math.random() * responses.length)] + 
                   " However, for more detailed information, I'd recommend checking reliable sources online.";
        }

        // Text-to-Speech
        function speak(text) {
            if (synthesis.speaking) {
                synthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = parseInt(document.getElementById('voice-speed').value) / 100;
            utterance.volume = parseFloat(document.getElementById('voice-volume').value);
            utterance.lang = document.getElementById('language').value;

            utterance.onstart = function() {
                isSpeaking = true;
                updateConnectionStatus('Speaking', 'speaking');
            };

            utterance.onend = function() {
                isSpeaking = false;
                updateConnectionStatus('Connected', 'connected');
            };

            synthesis.speak(utterance);
        }

        function stopSpeaking() {
            if (synthesis.speaking) {
                synthesis.cancel();
                isSpeaking = false;
                updateConnectionStatus('Connected', 'connected');
            }
        }

        // Connection Status
        function updateConnectionStatus(status, type) {
            const statusEl = document.getElementById('connection-status');
            statusEl.textContent = status;
            statusEl.className = 'connection-status';
            
            if (type === 'listening') {
                statusEl.style.background = 'rgba(255, 152, 0, 0.9)';
            } else if (type === 'speaking') {
                statusEl.style.background = 'rgba(33, 150, 243, 0.9)';
            } else {
                statusEl.style.background = 'rgba(76, 175, 80, 0.9)';
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            init3D();
            initSpeechRecognition();

            // Control buttons
            document.getElementById('mic-btn').addEventListener('click', function() {
                if (isListening) {
                    stopListening();
                } else {
                    startListening();
                }
            });

            document.getElementById('speak-btn').addEventListener('click', function() {
                if (lastResponse) {
                    speak(lastResponse);
                }
            });

            document.getElementById('demo-btn').addEventListener('click', function() {
                demoMode();
            });

            document.getElementById('stop-btn').addEventListener('click', function() {
                stopListening();
                stopSpeaking();
            });

            // Settings
            document.getElementById('voice-speed').addEventListener('input', function() {
                document.getElementById('speed-value').textContent = this.value + '%';
            });

            document.getElementById('voice-volume').addEventListener('input', function() {
                document.getElementById('volume-value').textContent = Math.round(this.value * 100) + '%';
            });

            document.getElementById('language').addEventListener('change', function() {
                if (recognition) {
                    recognition.lang = this.value;
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (isListening) {
                        stopListening();
                    } else {
                        startListening();
                    }
                } else if (e.code === 'Escape') {
                    stopListening();
                    stopSpeaking();
                }
            });
        });

        // Demo Mode
        function demoMode() {
            const demoCommands = [
                'Hello ARIA',
                'What time is it?',
                'Tell me about AI',
                'Search for JavaScript tutorials',
                'What is 25 plus 37?'
            ];

            let currentDemo = 0;
            const runDemo = () => {
                if (currentDemo < demoCommands.length) {
                    document.getElementById('command-display').textContent = demoCommands[currentDemo];
                    processCommand(demoCommands[currentDemo]);
                    currentDemo++;
                    setTimeout(runDemo, 4000);
                } else {
                    document.getElementById('command-display').textContent = 'Demo complete! Try saying something yourself.';
                }
            };

            document.getElementById('response-display').textContent = 'Starting demo mode...';
            setTimeout(runDemo, 2000);
        }

        // Window resize handler
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Initialize everything when page loads
        window.addEventListener('load', function() {
            updateConnectionStatus('Ready', 'connected');
            
            // Show initial instructions
            setTimeout(() => {
                document.getElementById('response-display').textContent = 
                    'Welcome to ARIA! Press the microphone button or spacebar to start talking. Try asking about the time, weather, or search for something!';
            }, 2000);
        });
    </script>
</body>
</html>