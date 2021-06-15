
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import { DRUM_SETTINGS } from './drum-settings'

gsap.registerPlugin(MotionPathPlugin);
class Manager {

  constructor(stage, dispatch) {
    this.stage = stage;
    this.dispatch = dispatch;
    this.debug = true;

    this.gui = new dat.GUI();
    
    this.debugFunctions = {export: () => {console.log(JSON.stringify(DRUM_SETTINGS, null, 2))}};

    if(!this.debug) this.gui.hide();

    this.gui.add(this.debugFunctions, 'export')

    this.models = {
      burger: {      
        file: 'burger-reduced.glb',
        debug: true,
        items: {}
      },
      drumkit: {      
        file: 'drums.glb',
        debug: false,
        items: {}
      }
    }

    this.loadModels();
  }

  addDebug(item){
      const name = item.name;
      
      // this.positionsDebug[name] = {
      //   position: {x: item.position.x, y: 5, z: item.position.z},
      //   rotation: {x: item.rotation.x, y: item.rotation.y, z: item.rotation.z},
      //   scale: {x: item.scale.x, y: item.scale.y, z: item.scale.z},
      // }

      const folder = this.gui.addFolder(name);

      ['position', 'rotation', 'scale'].forEach(prop => {
        ['x', 'y', 'z'].forEach(direction => {
          folder.add(DRUM_SETTINGS[name][prop], direction)
                .min(-5)
                .max(5)
                .step(0.01)
                .name(prop + ' ' + direction)
                .onChange(() => this.updateBurgerPositions())
        })
      })
  }

  loadModels() {
    console.log('loadModels');

    const loadingManager = new THREE.LoadingManager(() => {
      this.dispatch('loadComplete');
    })

    const gltfLoader = new GLTFLoader(loadingManager)

    Object.keys(this.models).forEach(id => {
      const model = this.models[id];
      
      gltfLoader.load(
        `/models/${model.file}`,
        (gltf) =>
        {
           
            
            gltf.scene.traverse(child => {
              
              if(child instanceof THREE.Mesh)
              {
                child.receiveShadow = true;
                child.castShadow = true;
              }
            })
                        
            const children = [ ...gltf.scene.children ]

            children.forEach(child => {

              if(model.debug) this.addDebug(child);

              model.items[child.name] = child;
              child.home = {
                position: {...child.position},
                rotation: {x: child.rotation.x, y: child.rotation.y, z: child.rotation.z},
                scale: {...child.scale},
              }
              child.position.y *= 2;
              
              this.stage.add(child)
            })
        }
      )  
    })
  }

  moveToDrums() {
    

    gsap.to(this.stage.camera.position, { x: 0, y: 4, z: 4 })
    gsap.to(this.stage.lookAt, { x: 0, y: 1, z: -1 })

    Object.keys(this.models.burger.items).forEach(key => {
      const item = this.models.burger.items[key];
      const pos = DRUM_SETTINGS[item.name];
      
      gsap.to(item.position, {motionPath: [{x: pos.position.x , y: pos.position.y * 2 + 0.5, z: pos.position.z}, {...pos.position}], duration: 2, ease: 'power4.inOut'})
      gsap.to(item.rotation, {...pos.rotation, duration: 1, delay: 0.5, ease: 'power4.inOut'})
      gsap.to(item.scale, {...pos.scale, duration: 1, ease: 'power4.inOut'})
    })
    
    Object.keys(this.models.drumkit.items).forEach(key => {
      const item = this.models.drumkit.items[key];
      gsap.to(item.position, {...item.home.position, duration: 1, ease: 'power4.out'})
      gsap.to(item.rotation, {...item.home.rotation, duration: 1, ease: 'power4.out'})
      gsap.to(item.scale, {...item.home.scale, duration: 1, ease: 'power4.out'})
    })
  }

  updateBurgerPositions() {
    if(this.debug)
    {
      Object.keys(this.models.burger.items).forEach(key => {
        const item = this.models.burger.items[key];
        item.position.copy(DRUM_SETTINGS[item.name].position)
        item.rotation.setFromVector3(DRUM_SETTINGS[item.name].rotation)
        item.scale.copy(DRUM_SETTINGS[item.name].scale)
      })
    }
  }
  
  moveToBurger() {

    gsap.to(this.stage.camera.position, {...this.stage.camera.home.position})
    gsap.to(this.stage.lookAt, { x: 0, y: 1, z: 0 })

    Object.keys(this.models.burger.items).forEach(key => {
      const item = this.models.burger.items[key];
      gsap.to(item.position, {motionPath: [{x: item.home.position.x , y: item.home.position.y * 3, z: item.home.position.z}, {...item.home.position}], duration: 2, ease: 'bounce'})
      gsap.to(item.rotation, {...item.home.rotation, duration: 1.5, ease: 'power4.inOut'})
      gsap.to(item.scale, {...item.home.scale, duration: 1.5, ease: 'power4.inOut'})
    })

    Object.keys(this.models.drumkit.items).forEach(key => {
      const item = this.models.drumkit.items[key];
      gsap.to(item.position, {y: -3})
      gsap.to(item.rotation, {z: (Math.random() * 0.5) - 0.25})
    })
  }

  updateView(newState) {
    if(newState === 'burger') this.moveToBurger();
    if(newState === 'drums') this.moveToDrums();
  }

  fire() {
    this.gui.destroy()
  }
}

export { Manager }