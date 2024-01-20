import { useEffect, useState } from "react"
import words from '../assets/words.json'

const MainMenu = ({setSelection, options, setOptions, maps, setMap}) => {
  const [showOption, setShowOption] = useState(0)
  const [wordsList, setWordsList] = useState("normal")

  const mapClicked = (map) => {
    setMap(map)
    setShowOption(2)
  }
  const difficultyClicked = (dif) => {
    const newOptions = {...options}
    newOptions.difficulty = dif
    setOptions(newOptions)
    setSelection(1)
  }
  const playClicked = () => {
    setShowOption(1)

    //for testing only!
    //mapClicked(maps[1])
    //difficultyClicked(0)
  }
  const howToPlayClicked = () => {
    setShowOption(3)
  }
  const quitClicked = () => {
    console.log("Quiting")
  }
  const levelEditorClicked = () => {
    setSelection(2)
  }

  const optionsClicked = () => {
    setShowOption(10)
  }
  const returnClicked = () => {
    setShowOption(0)
  }

  const optionsShadowClicked = () => {
    const newOptions = {...options}
    newOptions.shadows = !options.shadows
    setOptions(newOptions)
  }
  const optionsWordsListChanged = (event) => {
    const currentWordsList = event.target.value
    setWordsList(currentWordsList)
    const newOptions = {...options}
    newOptions.wordsList = currentWordsList
    setOptions(newOptions)
  }

  const playMusic = () => {
    const audio = document.getElementById('music')
    audio.play()
    audio.volume = 0.25
  }
  
  return (
    <div className="main-menu" onClick={playMusic}>
      <h1 className="title">Resident Typo</h1>
      {showOption==0 &&
        <div>
          <button onClick={()=>playClicked()} >
            Play
          </button>
          <button onClick={()=>howToPlayClicked()} >
            How to Play
          </button>
          <button onClick={()=>optionsClicked()} >
            Options
          </button>
          <button onClick={()=>levelEditorClicked()} >
            Level Editor
          </button>
          <button onClick={()=>quitClicked()} >
            Quit
          </button>
        </div>      
      }
      {showOption==1 &&
        <div>
          <h3>Choose Map</h3> 
          { maps.map( (map, index) => (
            <button key={index} onClick={()=>mapClicked(map)} >
              {map.name}
            </button>
          ))}          
        </div>
      }
      {showOption==2 &&
        <div>
          <h3>Choose Difficulty</h3> 
          <button onClick={()=>difficultyClicked(0)} >
            Easy Mode
          </button>
          <button onClick={()=>difficultyClicked(1)} >
            Normal Mode
          </button>
        </div>
      }

      {showOption==3 &&
        <div>
          <h3>How to play</h3>
          <p>Use space bar to switch between movement and typing mode</p>
          <p>In movement mode WASD moves your character</p>
          <p>The ` key switches weapons</p>
          <p>Switch to type mode to shoot at zombies</p>
          <p>Watch your ammo, misspellings cause missed shots</p>
          <p>The desert eagle will drop zombies in one shot</p>
          <p>If you run out of ammo, run up to an ammo barrel</p>
          <button onClick={()=>returnClicked()} >
            Return to menu
          </button>
        </div>
      }
      
      {/* Options Menu */}
      {showOption==10 &&
        <div>
          <h3>Options</h3>
          <button onClick={()=>returnClicked()} >
            Return to menu
          </button>
          <label>
          Word List: 
          <select value={wordsList} onChange={optionsWordsListChanged}>
            {Object.keys(words).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
          <button onClick={()=>optionsShadowClicked()} >
            Shadows: {options.shadows ? "On" : "Off"}
          </button>
        </div>
      }

      <audio 
        id="music"
        src='/scary-piano.wav'
        loop
        autoPlay
      />

    </div>
  )
}

export default MainMenu