import { useState } from "react"

const MainMenu = ({setOption, setDifficulty, maps, setMap}) => {
  const [showOption, setShowOption] = useState(0)

  const mapClicked = (map) => {
    setMap(map)
    setShowOption(2)
  }

  const difficultyClicked = (dif) => {
    setDifficulty(dif)
    setOption(1)
  }

  const playClicked = () => {
    setShowOption(1)
  }

  const quitClicked = () => {
    console.log("Quiting")
  }

  const levelEditorClicked = () => {
    setOption(2)
  }
  
  return (
    <div className="main-menu">
      <h1>Game</h1>
      {showOption==0 &&
        <div>
          <button onClick={()=>playClicked()} >
            Play
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

    </div>
  )
}

export default MainMenu