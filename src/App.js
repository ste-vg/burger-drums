import { useState } from 'react';
import './App.css';
import { BurgerDrum, BURGER_DRUM_VIEW } from "./components/burger-drum/burger-drum";

function App() {

  const {burgerState, setBurgerState } = useState(BURGER_DRUM_VIEW.burger);

  return (
    <div className="App">
      <BurgerDrum view={burgerState} />
    </div>
  );
}

export default App;
