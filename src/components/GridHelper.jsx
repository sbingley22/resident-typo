import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const GridHelper = ({ grid, gridSize }) => {
  const planeRefs = useRef([]);
  const materialRefs = useRef([])

  useFrame((scene) => {
    // You can access the refs using planeRefs.current
    grid.current.nodes.map((nodeRow, y) =>
        nodeRow.map((n, x) => {
          const index = (y * grid.current.width) + x
          if (n.walkable) {
            materialRefs.current[index].color.set(0,1,0)
          }
          else {
            materialRefs.current[index].color.set(0,1,0)
          }
    }))
  });

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
              <planeGeometry ref={(ref) => (planeRefs.current[y * grid.current.nodes[0].length + x] = ref)} />
              <meshStandardMaterial
                ref={(ref) => (materialRefs.current[y * grid.current.nodes[0].length + x] = ref)}
                color={n.walkable ? "green" : "red"} 
              />
            </mesh>
          </group>
        ))
      )}
    </>
  )
};

export default GridHelper
