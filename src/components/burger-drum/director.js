
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
            gltf.scene.traverse(child => {
              
              if(child instanceof THREE.Mesh)
              {
                child.material.receiveShadows = true;
                child.material.castShadows = true;
              }
            })
            
            const children = [ ...gltf.scene.children ]

            children.forEach(child => {
              console.log(child.name)
              model.items[child.name] = child;
              child.home = {
                position: {...child.position},
                rotation: {...child.rotation},
              }
              child.position.y *= 2;
              
              this.stage.add(child)
            })
              
        }
      )  
    })
      
  }

  moveToDrums() {
    Object.keys(this.models.burger.items).forEach(key => {
      const item = this.models.burger.items[key];
      gsap.to(item.position, {y: item.position.y * Math.random()})
      gsap.to(item.rotation, {z: (Math.random() * 0.5) - 0.25})
    })
  }
  
  moveToBurger() {
    Object.keys(this.models.burger.items).forEach(key => {
      const item = this.models.burger.items[key];
      gsap.to(item.position, {...item.home.position})
      gsap.to(item.rotation, {...item.home.rotation})
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