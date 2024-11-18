import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
        this.renderer.setClearColor(0x000816);
        this.renderer.shadowMap.enabled = true;
        
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 5, 10);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x001133, 0.5);
        this.scene.add(ambientLight);

        const moonLight = new THREE.DirectionalLight(0x3366ff, 1);
        moonLight.position.set(5, 10, 2);
        moonLight.castShadow = true;
        this.scene.add(moonLight);

        // Add volumetric fog
        this.scene.fog = new THREE.FogExp2(0x000816, 0.05);
    }

    createWater() {
        const waterGeometry = new THREE.PlaneGeometry(50, 50, 128, 128);
        const waterMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('waterVertexShader').textContent,
            fragmentShader: document.getElementById('waterFragmentShader').textContent,
            uniforms: {
                time: { value: 0 },
                distortionScale: { value: 3.0 }
            }
        });
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.scene.add(this.water);
    }

    createTurtle() {
        const loader = new GLTFLoader();
        loader.load('/static/models/turtle.js', (gltf) => {
            this.turtle = gltf.scene;
            this.turtle.scale.set(0.5, 0.5, 0.5);
            this.turtle.position.y = 2;
            this.scene.add(this.turtle);
            
            document.getElementById('loading').style.display = 'none';
            
            // Add uncanny animation
            this.mixer = new THREE.AnimationMixer(this.turtle);
            const clip = THREE.AnimationClip.findByName(gltf.animations, 'swim');
            if (clip) {
                const action = this.mixer.clipAction(clip);
                action.play();
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        if (this.water) {
            this.water.material.uniforms.time.value = time;
        }
        
        if (this.mixer) {
            this.mixer.update(0.016);
        }
        
        if (this.turtle) {
            this.turtle.rotation.y = Math.sin(time * 0.5) * 0.1;
            this.turtle.position.y = 2 + Math.sin(time) * 0.2;
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
