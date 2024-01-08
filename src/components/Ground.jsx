

const Ground = ({ position, size }) => {
  const meshPosition = [
    size[0]/2,
    0,
    size[1]/2,
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