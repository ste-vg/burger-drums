import { useEffect, useRef, useReducer, useState } from "react"
import { Stage } from "./stage";
import './burger-drum.css';
import { Manager } from "./manager";

function BurgerDrum() {

  const mount = useRef();  
  const [view, setView] = useState('loading');  
  const [manager, setManager] = useState(null);
  
  const init = () => {
    if(mount.current)
    {
      const stage = new Stage(mount.current)
      const _manager = new Manager(stage, view, setView);
  
      setManager(_manager);

      return () => {
        stage.destroy();
        _manager.fire();
      }
    }
  }

  const toggleView = () => { setView(view === 'burger' ? 'drums' : 'burger') }

  useEffect(init, [mount])
  useEffect(() => { if(manager) manager.updateView(view) }, [view, manager])

  return (
    <div className="burger-drum">
      <div className="container" ref={mount}></div>
      <p>{view}</p>
      <button onClick={(toggleView)}>Toggle</button>
    </div>
  )
}

export { BurgerDrum }