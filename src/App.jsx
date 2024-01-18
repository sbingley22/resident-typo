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
    wordsList: "coding",
  })

  const returnToMenu = () => {
    setSelection(0)
  }

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
      {selection==3 &&
        <div className='game-over'>
          <h1 className='title'>Game Over!</h1>
          <button onClick={returnToMenu}>Back to menu</button>
        </div>
      }
      {selection==4 &&
        <div className='game-over survivor'>
          <h1 className='title'>You Survived!</h1>
          <button onClick={returnToMenu}>Back to menu</button>
        </div>
      }
    </div>
  )
}

export default App