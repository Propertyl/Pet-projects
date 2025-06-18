import { useEffect } from "react"

const useDebounceEffect = (
  effect:() => any,
  deps:any[],
  delay:number
) => {
  useEffect(() => {
    const timer = setTimeout(effect,delay);

    return () => {
      clearTimeout(timer);
    }
  },[...deps,delay])
}

export default useDebounceEffect;