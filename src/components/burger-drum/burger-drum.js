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
    <div className={`burger-drum ${view}`}>
      <div className="container" ref={mount}></div>
      <div className="info">
        <p className="presents">Buns N' Roses presents:</p>
        <h1>Beat Burger</h1>
        <p>Our signature burger, inspired by legendary drummer <i>[your favorite drummer here]</i>. Order online now <i>(or don't because this is all pretend)</i> or transform this burger into a drum kit and play some sweet beats!</p>
        <div className="buttons">
          <button disabled>Order now</button>
          <button onClick={(toggleView)}>Play</button>
        </div>
      </div>
      <div className="controls">
        <button onClick={(toggleView)}>Back</button>
        <div>Tap the drums or use these keyboard keys: <span>Q</span><span>W</span><span>E</span><span>R</span><span>T</span><span>Y</span><span>U</span></div></div>
      <div className="loader">🤘 Loading 🤘</div>
    </div>
  )
}

export { BurgerDrum }