import { useEffect, useRef, useState } from "react"
import { Stage } from "./stage";
import './burger-drum.css';

const BURGER_DRUM_VIEW = {
  burger: 'burger',
  drum: 'drum'
}

function BurgerDrum({view}) {

  const mount = useRef();  
  const [stage, setStage] = useState(null);  

  const init = () => {
    const _stage = new Stage(mount.current)
    setStage (_stage);
    return () => {
      console.log('_stage', _stage)
      _stage.destroy();
    }
  }

  useEffect(init, [mount])

  return (
    <div className="burger-drum">
      <h1>{view}</h1>
      <p>lorem</p>
      <div className="container" ref={mount}></div>
    </div>
  )
}

export { BurgerDrum, BURGER_DRUM_VIEW }