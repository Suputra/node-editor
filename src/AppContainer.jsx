// Layout component that organizes the main sections of the application
// Splits the view into a left palette and main canvas area
import Palette from './components/Palette';
import Canvas from './components/Canvas';

export default () => (
  <div className="app-container">
    <Palette />
    <Canvas />
  </div>
); 