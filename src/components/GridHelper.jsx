import React from 'react';

const GridCell = React.memo(({ x, y, gridSize, n }) => (
  <group key={`${y}:${x}`} position={[n.x * gridSize, 0.01, n.y * gridSize]}>
    <mesh rotation-x={-Math.PI / 2} position={[gridSize / 2, 0, gridSize / 2]}>
      <planeGeometry args={[gridSize, gridSize]} />
      <meshStandardMaterial color={n.walkable ? "green" : "red"} />
    </mesh>
  </group>
));

const GridHelper = ({ grid, gridSize }) => {
  
  console.log(grid.current)

  return (
    <>
      {grid.nodes.map((nodeRow, y) =>
        nodeRow.map((node, x) => (
          <GridCell key={x+"::"+y} x={x} y={y} gridSize={gridSize} n={node} />
        ))
      )}
    </>
  );
};

export default GridHelper