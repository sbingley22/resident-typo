import { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { KeyboardControls, Stars, PerformanceMonitor, Stats } from "@react-three/drei"
import Map from './Map'
import HUD from './HUD'

function Game({ setSelection, map, setMap, options, setOptions}) {

  return (
    <div id="canvas-container">
      <KeyboardControls
        map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "typeMode", keys: ["Space"] },
        { name: "interact", keys: ["f", "F"] },
        ]}
      >
        <Canvas
          shadows
          camera={{ fov: 70, position: [12,5,17]}}
        >
          <Suspense>
            <Stars />

            <Map map={map} options={options} />

            <Stats />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <HUD />
    </div>
  )
}

export default Game
