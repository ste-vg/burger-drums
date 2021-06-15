
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

class Director {

  constructor(stage, dispatch) {
    this.stage = stage;
    this.dispatch = dispatch;

    this.models = {
      burger: {      
        file: 'burger-2.glb',
        shadows: true,
        items: {}
      },
      drumkit: {      
        file: 'drums.glb',
        shadows: false,
        items: {}
      }
    }

    this.loadModels();
  }

  loadModels() {
    console.log('loadModels');

    const loadingManager = new THREE.LoadingManager(() => {
      this.dispatch('loaded');
    })

    const gltfLoader = new GLTFLoader(loadingManager)

    Object.keys(this.models).forEach(id => {
      const model = this.models[id];
      
      gltfLoader.load(
        `/models/${model.file}`,
        (gltf) =>
        {
            if(model.shadows) {
              gltf.scene.traverse(child => {
                
                if(child instanceof THREE.Mesh)
                {
                  child.material.receiveShadows = true;
                  child.material.castShadows = true;
                }
              })
            }
            
            const children = [ ...gltf.scene.children ]

            children.forEach(child => {

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
    
    const burger = this.models.burger.items;

    gsap.to(burger['bun-top'].position, {x: 1.3, y: 1.6, z: 0.6, duration: 1, ease: 'power4.out'})
    gsap.to(burger['bun-top'].rotation, {x: Math.PI, duration: 1, ease: 'power4.out'})
    gsap.to(burger['bun-top'].scale, {x: 0.6, y: -0.5, z: 0.4, duration: 1, ease: 'power4.out'})
    
    Object.keys(this.models.drumkit.items).forEach(key => {
      const item = this.models.drumkit.items[key];
      gsap.to(item.position, {...item.home.position, duration: 1, ease: 'power4.out'})
      gsap.to(item.rotation, {...item.home.rotation, duration: 1, ease: 'power4.out'})
      gsap.to(item.scale, {...item.home.scale, duration: 1, ease: 'power4.out'})
    })
  }
  
  moveToBurger() {
    Object.keys(this.models.burger.items).forEach(key => {
      const item = this.models.burger.items[key];
      gsap.to(item.position, {...item.home.position, duration: 1.5, ease: 'power4.inOut'})
      gsap.to(item.rotation, {...item.home.rotation, duration: 1.5, ease: 'power4.inOut'})
      gsap.to(item.scale, {...item.home.scale, duration: 1.5, ease: 'power4.inOut'})
    })

    Object.keys(this.models.drumkit.items).forEach(key => {
      const item = this.models.drumkit.items[key];
      gsap.to(item.position, {x: item.position.x * -2 + Math.random(), y: -2})
      gsap.to(item.rotation, {z: (Math.random() * 0.5) - 0.25})
    })
  }

  updateView(newState) {
    if(newState === 'burger') this.moveToBurger();
    if(newState === 'drums') this.moveToDrums();
  }

  fire() {

  }
}

export { Director }