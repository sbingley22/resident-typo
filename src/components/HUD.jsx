import { useState, useEffect, useRef } from "react"
import usePlayerStore from "./stores/PlayerStore"

const HUD = () => {
  const health = usePlayerStore((state) => state.health)
  const currentWeapon = usePlayerStore((state) => state.currentWeapon)
  const weapons = usePlayerStore((state) => state.weapons)
  const mode = usePlayerStore((state) => state.mode)
  const targets = usePlayerStore((state) => state.targets)
  const [currentTarget, setCurrentTarget] = useState(null)
  const [currentLetter, setCurrentLetter] = useState(0)
  const inputRef = useRef(null)

  const setPlayerStore = (attribute, value) => {
    usePlayerStore.setState( state => {
      const newState = {...state}
      newState[attribute] = value
      return newState
    })
  }
  const shootTarget = (flag, value, id) => {
    usePlayerStore.setState( state => {
      const newState = {...state}
      newState["actionFlag"] = flag
      newState["actionValue"] = value
      newState["actionId"] = id
      return newState
    })
  }

  const decrementAmmo = () => {
    const newWeapons = {...weapons}
    newWeapons[currentWeapon].ammo -= 1
    setPlayerStore("weapons", newWeapons)
  }

  const typing = (e) => {
    const letter = e.target.value

    if (mode !== "typing") return
    
    if (currentTarget) {
      const target = targets.find(target => (target.gameid === currentTarget))
      if (!target) {
        console.log("Target not found!")
        setCurrentTarget(null)
        return
      }

      if (weapons[currentWeapon].ammo <= 0) {
        // Play click noise
        const audio = document.getElementById('emptyGunAudio')
        audio.play()
        audio.volume = 0.95
        return
      }
      
      if (lettersMatch(target, letter)) {
        if (target.name.length <= currentLetter + 1) {
          // word complete
          //console.log("Word Complete")
          setCurrentTarget(null)
          setCurrentLetter(0)

          //shoot enemy
          let dmg = 50
          if (currentWeapon === "pistol") {
            dmg = 50
            decrementAmmo()
          } else if (currentWeapon === "desert eagle") {
            dmg = 100
            decrementAmmo()
          }
          //console.log("HUD: ", target)
          shootTarget("enemyDmg", dmg, target.gameid)
        }
      } else {
        // missed shot
        //console.log("Missed Letter")
        setPlayerStore("Shot Missed")
        decrementAmmo()
      }
    } else {
      let targetSet = false
      targets.forEach(target => {
        if (targetSet) return

        if (lettersMatch(target, letter)) {
          setCurrentTarget(target.gameid)
          targetSet = true
          //console.log("New Target: " + target.gameid)
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

  useEffect(() => {
    setPlayerStore("currentTarget", currentTarget)
  }, [currentTarget])

  //console.log("HUD rerender")
  return (
    <div className="HUD">
      <div className="bottom-left">
        <h6>Health: {health}</h6>
      </div>
      <div className="bottom-right">
        <h6>Mode: {mode}</h6>
        <h6>{currentWeapon}: {weapons[currentWeapon].ammo}</h6>
      </div>
      <div className="top-right">
        <input ref={inputRef} type="text" onChange={typing} value="" />
      </div>

      { mode === "typing" &&
        <div className="target">
          {targets.map( (target) => (
            <div 
              key={target.gameid} 
              style={{ position: "absolute", left: target.pos[0]+"vw", bottom: target.pos[1]+"vh" }}
            >
              { target.gameid === currentTarget ?
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

      <audio 
        id="emptyGunAudio"
        src='/Gun_Cocking.wav'
        loop={false}
      />
    </div>   
  )
}

export default HUD