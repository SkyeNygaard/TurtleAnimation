import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Scene {
    constructor() {
        // Force a clean initialization
        if (window.currentScene) {
            window.currentScene.cleanup();
        }
        window.currentScene = this;
        
        this.init();
        this.setupLights();
        this.createWater();
        this.createEnvironment();
        this.createTurtle();
        this.createStickFigure();
        this.animate();
    }

    cleanup() {
        // Cleanup existing scene
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        this.renderer.dispose();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x001133);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('scene-container');
        container.innerHTML = ''; // Clear existing content
        container.appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 5, 10);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x6644ff, 2.0); // Increased intensity
        this.scene.add(ambientLight);

        const moonLight = new THREE.DirectionalLight(0xff3366, 3.0); // Increased intensity
        moonLight.position.set(5, 10, 2);
        moonLight.castShadow = true;
        this.scene.add(moonLight);

        // Add point lights for extra illumination
        const pointLight1 = new THREE.PointLight(0x00ffff, 2, 10);
        pointLight1.position.set(-5, 5, 0);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00ff, 2, 10);
        pointLight2.position.set(5, 5, 0);
        this.scene.add(pointLight2);
    }

    createEnvironment() {
        // Add floating debris
        for(let i = 0; i < 50; i++) {
            const debrisGeometry = new THREE.TetrahedronGeometry(0.2);
            const debrisMaterial = new THREE.MeshPhongMaterial({
                color: 0x445566,
                transparent: true,
                opacity: 0.6,
                shininess: 100
            });
            const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
            
            debris.position.set(
                (Math.random() - 0.5) * 40,
                Math.random() * 10,
                (Math.random() - 0.5) * 40
            );
            
            debris.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.scene.add(debris);
        }
    }

    createTurtle() {
        // Create main body group
        this.turtle = new THREE.Group();
        
        // Enhanced body with segments
        const bodyGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ff66,
            shininess: 100,
            specular: 0x66ff00
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.4, 1.2);
        this.turtle.add(body);

        // Create human face
        const faceGroup = new THREE.Group();
        
        // Face base
        const faceGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const faceMaterial = new THREE.MeshPhongMaterial({
            color: 0xffe0bd,
            shininess: 50
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        const eyeIrisMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000
        });
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const leftIris = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            eyeIrisMaterial
        );
        leftEye.position.set(-0.15, 0.1, 0.35);
        leftIris.position.set(-0.15, 0.1, 0.38);
        
        // Right eye
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightIris = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            eyeIrisMaterial
        );
        rightEye.position.set(0.15, 0.1, 0.35);
        rightIris.position.set(0.15, 0.1, 0.38);
        
        // Mouth - curved and unsettling
        const mouthShape = new THREE.Shape();
        mouthShape.moveTo(-0.15, -0.1);
        mouthShape.quadraticCurveTo(0, -0.2, 0.15, -0.1);
        const mouthGeometry = new THREE.ShapeGeometry(mouthShape);
        const mouthMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.z = 0.35;
        
        faceGroup.add(face, leftEye, rightEye, leftIris, rightIris, mouth);
        faceGroup.position.set(0, 0, 1.8);
        this.turtle.add(faceGroup);

        // Shell with patterns
        const shellGeometry = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const shellMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff3366,
            shininess: 80,
            specular: 0xff00ff
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.position.set(0, 0.3, 0);
        shell.rotation.x = Math.PI;
        
        // Shell patterns
        const patternGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 6);
        const patternMaterial = new THREE.MeshPhongMaterial({
            color: 0xff99cc
        });
        const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
        pattern.rotation.x = Math.PI / 2;
        pattern.position.y = 0.4;
        shell.add(pattern);
        
        this.turtle.add(shell);

        this.turtle.position.y = 2;
        this.scene.add(this.turtle);
        
        document.getElementById('loading').style.display = 'none';
    }

    createStickFigure() {
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 30
        });
        
        this.stickFigure = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.5;
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1;
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const leftArm = new THREE.Mesh(armGeometry, material);
        leftArm.position.set(-0.3, 0.8, 0);
        leftArm.rotation.z = Math.PI / 2;
        
        const rightArm = new THREE.Mesh(armGeometry, material);
        rightArm.position.set(0.3, 0.8, 0);
        rightArm.rotation.z = -Math.PI / 2;
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-0.2, 0.3, 0);
        leftLeg.rotation.z = Math.PI / 6;
        
        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(0.2, 0.3, 0);
        rightLeg.rotation.z = -Math.PI / 6;
        
        this.stickFigure.add(body, head, leftArm, rightArm, leftLeg, rightLeg);
        this.stickFigure.position.set(2, 3, 0);
        this.scene.add(this.stickFigure);
        
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
            
            // Make face look more unsettling by adjusting features
            const face = this.turtle.children[1];
            if (face) {
                face.rotation.y = Math.sin(time * 0.3) * 0.1;
                face.rotation.x = Math.cos(time * 0.4) * 0.1;
            }
        }
        
        if (this.stickFigure) {
            this.stickFigureVelocity.y -= 9.8 * 0.016;
            this.stickFigure.position.x += this.stickFigureVelocity.x * 0.016;
            this.stickFigure.position.y += this.stickFigureVelocity.y * 0.016;
            this.stickFigure.rotation.z += this.stickFigureAngularVel * 0.016;
            
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

// Clean up any existing scene before creating new one
if (window.currentScene) {
    window.currentScene.cleanup();
}

new Scene();
