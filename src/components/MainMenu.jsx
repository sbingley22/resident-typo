import { useState } from "react"

const MainMenu = ({setOption, setDifficulty, setMap}) => {
  const [showOption, setShowOption] = useState(0)

  const mapClicked = (name) => {
    setMap(name)
    setShowOption(1)
  }

  const difficultyClicked = (dif) => {
    setDifficulty(dif)
    setOption(1)
  }
  
  return (
    <div className="main-menu">
      <h1>Game</h1>
      {showOption==0 &&
        <div>
          <h3>Choose Map</h3> 
          <button onClick={()=>mapClicked("Map 0")} >
            Map 0
          </button>
          <button onClick={()=>mapClicked("Map 1")} >
            Map 1
          </button>
        </div>
      }
      {showOption==1 &&
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