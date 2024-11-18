import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Scene {
    constructor() {
        this.init();
        this.setupLights();
        this.createWater();
        this.createTurtle();
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

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        if (this.water) {
            this.water.material.uniforms.time.value = time;
        }
        
        if (this.turtle) {
            this.turtle.rotation.y = Math.sin(time * 0.5) * 0.3; // More rotation
            this.turtle.position.y = 2 + Math.sin(time) * 0.5;   // More vertical movement
            this.turtle.rotation.z = Math.sin(time * 0.7) * 0.1; // Add slight tilting
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
