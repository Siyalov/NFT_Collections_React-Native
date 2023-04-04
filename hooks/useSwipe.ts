import { GestureResponderEvent } from "react-native/types";

export function useSwipeX({
  onSwipeLeft,
  onSwipeRight,
  offset = 20,
} : {
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  offset: number
}) {
  let firstTouchX = 0;
  let block = false;

  function onTouchStart(event: GestureResponderEvent) {
    firstTouchX = event.nativeEvent.pageX;
    block = false;
  }
  
  function onTouchMove(event: GestureResponderEvent) {
    const positionX = event.nativeEvent.pageX;
    if (block) return;

    if (positionX - firstTouchX > offset) {
      block = true;
      if (typeof onSwipeRight === 'function') {
        onSwipeRight();
      }
    } else if (firstTouchX - positionX > offset) {
      block = true;
      if (typeof onSwipeLeft === 'function') {
        onSwipeLeft();
      }
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: onTouchMove,
  }
}