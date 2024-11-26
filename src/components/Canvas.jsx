import { useState, useRef } from 'react';

export default () => {
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const [drawingConnection, setDrawingConnection] = useState(null);
  const canvasRef = useRef(null);

  const handleDragOver = e => {
    e.preventDefault();
    if (draggedNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      setNodes(nodes.map(node => 
        node.id === draggedNode.id 
          ? { 
              ...node, 
              position: {
                x: e.clientX - rect.left - dragOffset.x,
                y: e.clientY - rect.top - dragOffset.y,
              }
            }
          : node
      ));
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    if (!draggedNode) {
      const shape = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      setNodes([
        ...nodes,
        {
          id: `${shape.id}-${Date.now()}`,
          type: shape.id,
          position: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        },
      ]);
    }
    setDraggedNode(null);
  };

  const handleNodeDragStart = (e, node) => {
    if (e.target.classList.contains('connection-point') || 
        e.target.classList.contains('node-handle')) {
      e.preventDefault();
      return;
    }
    
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedNode(node);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getNodeConnectionPoint = (node, point) => {
    const nodeElement = document.getElementById(node.id);
    if (!nodeElement) return { x: 0, y: 0 };

    const rect = nodeElement.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const baseX = rect.left - canvasRect.left;
    const baseY = rect.top - canvasRect.top;

    switch (point) {
      case 'top': return { x: baseX + rect.width / 2, y: baseY };
      case 'right': return { x: baseX + rect.width, y: baseY + rect.height / 2 };
      case 'bottom': return { x: baseX + rect.width / 2, y: baseY + rect.height };
      case 'left': return { x: baseX, y: baseY + rect.height / 2 };
      default: return { x: 0, y: 0 };
    }
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={e => {
        if (drawingConnection) {
          const rect = canvasRef.current.getBoundingClientRect();
          setDrawingConnection({
            ...drawingConnection,
            end: {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            },
          });
        }
      }}
      onMouseUp={() => setDrawingConnection(null)}
    >
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        {connections.map(conn => {
          const sourceNode = nodes.find(n => n.id === conn.sourceId);
          const targetNode = nodes.find(n => n.id === conn.targetId);
          if (!sourceNode || !targetNode) return null;

          const start = getNodeConnectionPoint(sourceNode, conn.sourcePoint);
          const end = getNodeConnectionPoint(targetNode, conn.targetPoint);
          const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

          return (
            <g key={conn.id}>
              <path
                d={`M ${start.x},${start.y} L ${end.x},${end.y}`}
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M -6 -6 L 0 0 L -6 6"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                transform={`translate(${end.x},${end.y}) rotate(${angle})`}
              />
            </g>
          );
        })}
        {drawingConnection && (
          <path
            d={`M ${drawingConnection.start.x},${drawingConnection.start.y} 
               L ${drawingConnection.end.x},${drawingConnection.end.y}`}
            stroke="var(--primary)"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
            opacity="0.5"
          />
        )}
      </svg>

      {nodes.map(node => (
        <div
          id={node.id}
          key={node.id}
          className="node"
          draggable
          onDragStart={e => handleNodeDragStart(e, node)}
          style={{
            position: 'absolute',
            left: node.position.x,
            top: node.position.y,
            padding: node.type === 'diamond' ? 0 : '1rem',
            backgroundColor: '#fff',
            border: '2px solid #333',
            borderRadius: node.type === 'circle' ? '50%' : '4px',
            transform: node.type === 'diamond' ? 'rotate(45deg)' : 'none',
            zIndex: 1,
            ...(node.type === 'diamond' && {
              width: '80px',
              height: '80px',
            })
          }}
        >
          <div className="node-handle" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) ${node.type === 'diamond' ? 'rotate(-45deg)' : ''}`,
            cursor: 'move',
            padding: '10px',
            width: node.type === 'diamond' ? '100%' : '60%',
            height: node.type === 'diamond' ? '100%' : '60%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {node.type}
          </div>

          {['top', 'right', 'bottom', 'left'].map(point => (
            <div
              key={point}
              className={`connection-point ${point}`}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
                const rect = canvasRef.current.getBoundingClientRect();
                setDrawingConnection({
                  sourceId: node.id,
                  sourcePoint: point,
                  start: {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  },
                  end: {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  },
                });
              }}
              onMouseUp={e => {
                e.preventDefault();
                e.stopPropagation();
                if (drawingConnection && drawingConnection.sourceId !== node.id) {
                  setConnections([
                    ...connections,
                    {
                      id: `connection-${Date.now()}`,
                      sourceId: drawingConnection.sourceId,
                      targetId: node.id,
                      sourcePoint: drawingConnection.sourcePoint,
                      targetPoint: point,
                    },
                  ]);
                }
                setDrawingConnection(null);
              }}
              style={{
                transform: node.type === 'diamond' ? 'rotate(-45deg)' : 'none'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}; 