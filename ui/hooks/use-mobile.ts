import * as React from "react"

/**
 * useIsMobile is a custom React hook that determines if the current viewport width
 * classifies the device as mobile based on a predefined breakpoint.
 * It listens for window resize events to update the mobile status dynamically.
 * @return {boolean} A boolean indicating whether the device is considered mobile.
 * @author System
 */
const MOBILE_BREAKPOINT = 768


/**
 * useIsMobile is a custom React hook that determines if the current viewport width
 * classifies the device as mobile based on a predefined breakpoint.
 * It listens for window resize events to update the mobile status dynamically.
 * @return {boolean} A boolean indicating whether the device is considered mobile.
 * @author System
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
