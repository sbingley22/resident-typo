import { useFrame } from "@react-three/fiber";

const GridHelper = ({ grid, gridSize }) => {
  
  console.log(grid.current)

  useFrame( (scene) => {
    
  })

  return (
    <>
      {grid.current.nodes.map((nodeRow, y) =>
        nodeRow.map((n, x) => (
          <group 
            key={`${y}:${x}`} 
            position={[n.x * gridSize, 0.01, n.y * gridSize]}
          >
            <mesh 
              rotation-x={-Math.PI / 2} 
              position={[gridSize / 2, 0, gridSize / 2]} 
              scale={gridSize}
            >
              <planeGeometry />
              <meshStandardMaterial color={n.walkable ? "green" : "red"} />
            </mesh>
          </group>
        ))
      )}
    </>
  );
};

export default GridHelper