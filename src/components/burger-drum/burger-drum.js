import { useEffect, useRef, useState } from "react"
import { Stage } from "./stage";
import './burger-drum.css';

function BurgerDrum() {

  const mount = useRef();  
  
  const init = () => {
    if(mount.current)
    {
      const stage = new Stage(mount.current)
      
      return () => {
        stage.destroy();
      }
    }
  }

  useEffect(init, [mount])
  
  return (
    <div className="burger-drum">
      <div className="container" ref={mount}></div>
    </div>
  )
}

export { BurgerDrum }