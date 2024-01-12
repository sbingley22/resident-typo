import { useState } from "react"

const MainMenu = ({setSelection, options, setOptions, maps, setMap}) => {
  const [showOption, setShowOption] = useState(0)

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
  
  return (
    <div className="main-menu">
      <h1>Game</h1>
      {showOption==0 &&
        <div>
          <button onClick={()=>playClicked()} >
            Play
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
      
      {/* Options Menu */}
      {showOption==10 &&
        <div>
          <h3>Options</h3>
          <button onClick={()=>returnClicked()} >
            Return to menu
          </button>
          <button onClick={()=>optionsShadowClicked()} >
            Shadows: {options.shadows ? "On" : "Off"}
          </button>
        </div>
      }

    </div>
  )
}

export default MainMenu