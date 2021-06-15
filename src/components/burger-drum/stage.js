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
    this.setupFloor();
    this.setupFog();
    this.setupRenderer();
    
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
    
    this.tick();
  }

  setupLights() {

    const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(2, 4, 1);
    this.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x522142, 0.5 );
    this.add(hemisphereLight)
  }

  setupCamera() {

    this.lookAt = new THREE.Vector3(0, 1, 0);
    this.camera = new THREE.PerspectiveCamera(40, this.size.width / this.size.height, 0.1, 100);
    this.camera.position.set(0, 3, 6);
    this.camera.home = {
      position: { ...this.camera.position }
    }
    
    this.add(this.camera);
  }

  setupFloor() {
    const plane = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: '#522142' })
    const floor = new THREE.Mesh(plane, floorMaterial);
    floor.receiveShadow = true;
    
    floor.rotateX(-Math.PI * 0.5)

    this.add(floor);
  }

  setupFog() {
    const fog = new THREE.Fog("#142522", 6, 20)
    this.scene.fog = fog;
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
    this.camera.lookAt(this.lookAt);
    
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