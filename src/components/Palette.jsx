// Palette component that provides draggable shape elements
// Each shape can be dragged onto the canvas to create a new node
import React from 'react';

const Palette = () => {
  // Define available shapes - extend this array to add new shape types
  const shapes = [
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'circle', name: 'Circle' },
    { id: 'diamond', name: 'Diamond' },
  ];

  return (
    <div className="palette">
      <h3>Shapes</h3>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="shape-item"
          draggable
          onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(shape))}
        >
          {shape.name}
        </div>
      ))}
    </div>
  );
};

export default Palette; 