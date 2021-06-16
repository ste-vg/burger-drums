import { useEffect, useRef, useReducer, useState } from "react"
import { Stage } from "./stage";
import './burger-drum.css';
import { Manager } from "./manager";

const VIEW_STATE_MACHINE = {
  loading: {
    loadComplete: 'burger'
  },
  burger: {
    toggle: 'drums'
  },
  drums: {
    toggle: 'burger'
  }
}

function miniStateMachine(currentState, action) {
  const nextState = VIEW_STATE_MACHINE[currentState][action]
  return nextState !== undefined ? nextState : currentState
}

function BurgerDrum() {

  const mount = useRef();  
  const [view, dispatch] = useReducer(miniStateMachine, 'loading');  
  const [manager, setManager] = useState(null);
  
  const init = () => {
    if(mount.current)
    {
      const stage = new Stage(mount.current)
      const _manager = new Manager(stage, view, dispatch);
  
      setManager(_manager);

      return () => {
        stage.destroy();
        _manager.fire();
      }
    }
  }

  const toggleView = () => { dispatch('toggle') }

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