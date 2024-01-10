import { useState } from 'react'
import './App.css'
import maps from './components/models/maps.json'
import Game from './components/Game'
import MainMenu from './components/MainMenu'
import MapMaker from './components/MapMaker'

function App() {
  const [option, setOption] = useState(2)
  const [map, setMap] = useState(null)
  const [difficulty, setDifficulty] = useState(0)

  

  return (
    <div>
      {option==0 && <MainMenu setOption={setOption} setDifficulty={setDifficulty} setMap={setMap} />}
      {option==1 && 
        <Game 
          setOption={setOption} 
          map={map} 
          setMap={setMap}
          difficulty={difficulty}
        />}
      {option==2 && <MapMaker setOption={setOption} maps={maps} setMap={setMap} />}
    </div>
  )
}

export default App