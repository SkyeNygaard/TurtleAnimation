import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Scene {
    constructor() {
        this.init();
        this.setupLights();
        this.createWater();
        this.createTurtle();
        this.createStickFigure();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x001133);
        this.renderer.shadowMap.enabled = true;
        
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 5, 10);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x6644ff, 1.5);
        this.scene.add(ambientLight);

        const moonLight = new THREE.DirectionalLight(0xff3366, 2);
        moonLight.position.set(5, 10, 2);
        moonLight.castShadow = true;
        this.scene.add(moonLight);

        // Add volumetric fog
        this.scene.fog = new THREE.FogExp2(0x001133, 0.03);
    }

    createWater() {
        const waterGeometry = new THREE.PlaneGeometry(50, 50, 128, 128);
        const waterMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('waterVertexShader').textContent,
            fragmentShader: document.getElementById('waterFragmentShader').textContent,
            uniforms: {
                time: { value: 0 },
                distortionScale: { value: 5.0 }
            }
        });
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.scene.add(this.water);
    }

    createTurtle() {
        // Create a simple turtle shape using basic geometries
        const body = new THREE.BoxGeometry(2, 0.5, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ff66,  // Bright toxic green
            shininess: 100,
            specular: 0x66ff00
        });
        this.turtle = new THREE.Mesh(body, bodyMaterial);

        // Add head
        const head = new THREE.BoxGeometry(0.8, 0.4, 0.6);
        const headMesh = new THREE.Mesh(head, bodyMaterial);
        headMesh.position.set(0, 0, 1.8);
        this.turtle.add(headMesh);

        // Add shell dome
        const shell = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const shellMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff3366,  // Neon pink
            shininess: 80,
            specular: 0xff00ff
        });
        const shellMesh = new THREE.Mesh(shell, shellMaterial);
        shellMesh.position.set(0, 0.3, 0);
        shellMesh.rotation.x = Math.PI;
        this.turtle.add(shellMesh);

        this.turtle.position.y = 2;
        this.scene.add(this.turtle);

        // Remove loading message
        document.getElementById('loading').style.display = 'none';
    }

    createStickFigure() {
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        
        // Create stick figure geometry
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));     // Base
        points.push(new THREE.Vector3(0, 1, 0));     // Body
        points.push(new THREE.Vector3(-0.5, 0.7, 0)); // Left arm
        points.push(new THREE.Vector3(0, 1, 0));     // Back to body
        points.push(new THREE.Vector3(0.5, 0.7, 0));  // Right arm
        points.push(new THREE.Vector3(0, 1, 0));     // Back to body
        points.push(new THREE.Vector3(-0.3, -0.5, 0)); // Left leg
        points.push(new THREE.Vector3(0, 0, 0));     // Back to base
        points.push(new THREE.Vector3(0.3, -0.5, 0));  // Right leg
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.stickFigure = new THREE.Line(geometry, material);
        this.stickFigure.position.set(2, 3, 0);
        this.scene.add(this.stickFigure);
        
        // Physics properties
        this.stickFigureVelocity = new THREE.Vector3(0, 0, 0);
        this.stickFigureAngularVel = 0;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        if (this.water) {
            this.water.material.uniforms.time.value = time;
        }
        
        if (this.turtle) {
            // Jerky movement - snap to new positions every few seconds
            if (Math.floor(time) % 3 === 0 && !this.hasSnapped) {
                this.turtle.position.x = (Math.random() - 0.5) * 10;
                this.turtle.position.z = (Math.random() - 0.5) * 10;
                this.hasSnapped = true;
                
                // Apply force to stick figure when turtle snaps
                if (this.stickFigure) {
                    this.stickFigureVelocity.y = 5;
                    this.stickFigureVelocity.x = (Math.random() - 0.5) * 3;
                    this.stickFigureAngularVel = (Math.random() - 0.5) * 10;
                }
            } else if (Math.floor(time) % 3 !== 0) {
                this.hasSnapped = false;
            }
            
            this.turtle.rotation.y = Math.sin(time * 0.5) * 0.3;
            this.turtle.position.y = 2 + Math.sin(time) * 0.5;
            this.turtle.rotation.z = Math.sin(time * 0.7) * 0.1;
        }
        
        // Update stick figure physics
        if (this.stickFigure) {
            // Apply gravity
            this.stickFigureVelocity.y -= 9.8 * 0.016; // gravity * deltaTime
            
            // Update position
            this.stickFigure.position.x += this.stickFigureVelocity.x * 0.016;
            this.stickFigure.position.y += this.stickFigureVelocity.y * 0.016;
            
            // Rotate stick figure
            this.stickFigure.rotation.z += this.stickFigureAngularVel * 0.016;
            
            // Ground collision
            if (this.stickFigure.position.y < 1) {
                this.stickFigure.position.y = 1;
                this.stickFigureVelocity.y = Math.abs(this.stickFigureVelocity.y) * 0.5;
                this.stickFigureVelocity.x *= 0.8;
                this.stickFigureAngularVel *= 0.8;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new Scene();
