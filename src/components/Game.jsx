import { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { KeyboardControls, Stars } from "@react-three/drei"
import Map from './Map'

function Game({ setOption, map, setMap, difficulty}) {

  return (
    <div id="canvas-container">
      <KeyboardControls
        map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "interact", keys: ["f", "F"] },
        ]}
      >
        <Canvas
          shadows
          camera={{ fov: 70, position: [12,5,17]}}
        >
          <Suspense>
            <Stars />

            <Map map={map} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default Game
