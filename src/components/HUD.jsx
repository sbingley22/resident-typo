import { useState, useEffect, useRef } from "react"
import usePlayerStore from "./stores/PlayerStore"

const HUD = () => {
  const health = usePlayerStore((state) => state.health)
  const ammo = usePlayerStore((state) => state.ammo)
  const mode = usePlayerStore((state) => state.mode)
  const targets = usePlayerStore((state) => state.targets)
  const [currentTarget, setCurrentTarget] = useState(null)
  const [currentLetter, setCurrentLetter] = useState(0)
  const inputRef = useRef(null)

  const typing = (e) => {
    const letter = e.target.value
    
    if (currentTarget) {
      const target = targets.find(target => (target.id === currentTarget))
      if (!target) {
        console.log("No targets found")
        setCurrentTarget(null)
        return
      }
      
      if (lettersMatch(target, letter)) {
        if (target.name.length <= currentLetter + 1) {
          // word complete
          console.log("Word Complete")
          setCurrentTarget(null)
          setCurrentLetter(0)
          //shoot enemy
        }
      } else {
        // missed shot
        console.log("Missed Letter")
      }
    } else {
      let targetSet = false
      targets.forEach(target => {
        if (targetSet) return

        if (lettersMatch(target, letter)) {
          setCurrentTarget(target.id)
          targetSet = true
          console.log("New Target: " + target.enemyid)
        }
      });
    }
  }

  const lettersMatch = (target, letter) => {
    const word = target.name
    const targetLetter = word[currentLetter]
    if (targetLetter == letter) {
      setCurrentLetter(prev => prev+1)
      return true
    }
    return false
  }

  useEffect(() => {
    if (mode === "typing" && inputRef.current) {
      inputRef.current.focus()
    }
    else {
    }
  }, [mode])

  //console.log("HUD rerender")
  return (
    <div className="HUD">
      <div className="top-left">
        <h6>Health: {health}</h6>
      </div>
      <div className="top-right">
        <h6>Mode: {mode}</h6>
        <h6>Ammo: {ammo}</h6>
      </div>
      <div className="bottom-right">
        <input ref={inputRef} type="text" onChange={typing} value="" />
      </div>

      { mode === "typing" &&
        <div className="target">
          {targets.map( (target) => (
            <div 
              key={target.id} 
              style={{ position: "absolute", left: target.pos[0]+"vw", bottom: target.pos[1]+"vh" }}
            >
              { target.id === currentTarget ?
                <>
                  <h3 className="shot">{target.name.substring(0, currentLetter)}</h3>
                  <h3 className="unshot">{target.name.substring(currentLetter)}</h3>
                </>
                :
                <h3 className="unshot">{target.name}</h3>
              }
            </div>
          ))}
        </div>
      }
    </div>   
  )
}

export default HUD