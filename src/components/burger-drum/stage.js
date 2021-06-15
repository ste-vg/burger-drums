import * as THREE from "three";

class Stage {

  constructor(mount) {

    this.container = mount;
      
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( '#142522' );
    
    this.size = {
      width: 1,
      height: 1
    }

    this.setupLights();
    this.setupCamera();
    
    this.setupRenderer();
    
    this.onResize();
    this.tick();

    this.onResize = this.onResize.bind(this);

    window.addEventListener('resize', this.onResize);
  }

  setupLights() {

    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    // directionalLight.shadow.camera.far = 15;
    // directionalLight.shadow.mapSize.set(1024, 1024);
    // directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(5, 10, 7);
    this.add(directionalLight);
  }

  setupCamera() {

    this.camera = new THREE.PerspectiveCamera(40, this.size.width / this.size.height, 0.1, 100);
    this.camera.position.set(3, 3, -5);
    
    this.add(this.camera);
  }

  setupRenderer() {

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      
    })
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild( this.renderer.domElement );
  }

  onResize() {
  
    this.size.width = this.container.clientWidth;
    this.size.height = this.container.clientHeight;

    this.camera.aspect = this.size.width / this.size.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.size.width, this.size.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  tick() {
    this.camera.lookAt(-2, 0, 3);
    
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.tick())
  }

  add(element) { this.scene.add(element);}
  
  destroy() {

    this.container.removeChild( this.renderer.domElement);
    window.removeEventListener('resize', this.onResize);
  }
}

export { Stage }