# Node Graph Editor

A modern, interactive node graph editor built with React. This editor allows users to create, connect, and manipulate different shapes in a canvas environment.

## Features

- Drag-and-drop interface for creating nodes
- Three shape types: Rectangle, Circle, and Diamond
- Interactive connection points for creating directional arrows between nodes
- Modern dark theme with a grid-based canvas
- Smooth animations and transitions
- Responsive layout

## Technical Implementation

### Core Components

- **App.jsx**: Root component
- **AppContainer.jsx**: Layout wrapper that organizes the Palette and Canvas
- **Palette.jsx**: Left sidebar containing draggable shape elements
- **Canvas.jsx**: Main workspace where nodes can be placed and connected

### Key Features Implementation

1. **Node Management**
   - Nodes are stored in state with position and type information
   - Drag and drop API used for node creation and movement
   - Custom handling prevents dragging when using connection points

2. **Connections**
   - SVG-based arrows with directional indicators
   - Connection points appear on node hover
   - Real-time connection preview while dragging

3. **Styling**
   - CSS Variables for consistent theming
   - Grid background for spatial reference
   - Smooth transitions and hover effects
   - Modern dark theme with accent colors

## Future Improvements

- Add node deletion
- Implement connection deletion
- Add node content editing
- Save/load functionality
- Undo/redo system
- Custom node types
- Mobile responsiveness
