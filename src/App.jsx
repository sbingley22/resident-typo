import { useState } from 'react'
import './App.css'
import maps from './components/models/maps.json'
import Game from './components/Game'
import MainMenu from './components/MainMenu'
import MapMaker from './components/MapMaker'

function App() {
  const [selection, setSelection] = useState(0)
  const [map, setMap] = useState(null)
  const [options, setOptions] = useState({
    difficulty: 1,
    shadows: false,
  })

  return (
    <div>
      {selection==0 && 
        <MainMenu 
          setSelection={setSelection} 
          options={options}
          setOptions={setOptions} 
          maps={maps}
          setMap={setMap} 
        />
      }
      {selection==1 && 
        <Game 
          setSelection={setSelection} 
          map={map} 
          setMap={setMap}
          options={options}
          setOptions={setOptions}
        />
      }
      {selection==2 &&
        <MapMaker 
          setSelection={setSelection} 
          maps={maps}
          setMap={setMap}
        />
      }
    </div>
  )
}

export default App