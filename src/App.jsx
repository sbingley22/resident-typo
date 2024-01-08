import './App.css'
import { useState, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { KeyboardControls, Stars } from "@react-three/drei"
import Map from './components/Map'

function App() {

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
            <ambientLight intensity={0.2} />
            <Stars />

            <Map />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default App
