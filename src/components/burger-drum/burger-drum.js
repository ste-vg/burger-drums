import { useEffect, useRef, useReducer, useState } from "react"
import { Stage } from "./stage";
import './burger-drum.css';
import { Manager } from "./manager";

const VIEW_STATES = {
  loading: 'loading',
  burger: 'burger',
  drums: 'drums'
}

const VIEW_STATE_MACHINE = {
  loading: {
    loaded: VIEW_STATES.burger
  },
  burger: {
    toggle: VIEW_STATES.drums
  },
  drums: {
    toggle: VIEW_STATES.burger
  }
}

function miniStateMachine(currentState, action) {
  const nextState = VIEW_STATE_MACHINE[currentState][action]
  return nextState !== undefined ? nextState : currentState
}

function BurgerDrum() {

  const mount = useRef();  
  const [view, dispatch] = useReducer(miniStateMachine, VIEW_STATES.loading);  
  const [director, setDirector] = useState(null);

  const init = () => {
    if(mount)
    {
      const _stage = new Stage(mount.current)
      const _manager = new Manager(_stage, dispatch);
  
      setDirector(_manager);

      return () => {
        _stage.destroy();
        _manager.fire();
      }
    }
  }

  const toggleView = () => { dispatch('toggle') }

  useEffect(init, [mount])
  useEffect(() => {
    if(director) director.updateView(view)
  }, [view, director])

  return (
    <div className="burger-drum">
      <div className="container" ref={mount}></div>
      <p>{view}</p>
      <button onClick={(toggleView)}>Toggle</button>
    </div>
  )
}

export { BurgerDrum }