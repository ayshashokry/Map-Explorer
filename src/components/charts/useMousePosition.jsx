import { useLayoutEffect, useState } from "react";

//This is the method I use for detecting actual  mouse position
export default function useMousePosition() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  useLayoutEffect(() => {
    function updatePosition(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    document.addEventListener("mousemove", updatePosition);
    return () => document.removeEventListener("mousemove", updatePosition);
  }, []);

  return position;
}
