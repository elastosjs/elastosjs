
import { useState, useCallback } from 'react'

export const useEffectTrigger = () => {
  const [effectTrigger, setTick] = useState(0)

  const triggerEffect = useCallback(() => {
    setTick(effectTrigger + 1)
  }, [])

  return [effectTrigger, triggerEffect]
}
