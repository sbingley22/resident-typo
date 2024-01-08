

const Ground = ({ position, size, gridSize }) => {
  const meshPosition = [
    (size[0]/2) * gridSize,
    0,
    (size[1]/2) * gridSize,
  ]
  return (
    <group
      position={position}
    >
      <mesh
        receiveShadow
        position={meshPosition}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  )
}

export default Ground