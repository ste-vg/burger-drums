import './App.css';
import { BurgerDrum } from "./components/burger-drum/burger-drum";

function App() {

    return (
    <div className="App">
      <BurgerDrum />
      <a href="https://youtu.be/VtmsuVT7BGI" target="_blank" className="component-carousel">
        <span>Watch us make this on</span>
        <img src="/images/component-carousel.png" alt="Component Carousel" /> 
      </a>
    </div>
  );
}

export default App;
