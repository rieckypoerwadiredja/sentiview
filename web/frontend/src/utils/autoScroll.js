import React, { useEffect, useRef } from "react";

export function useChatScroll(dep) {
  const ref = useRef();
  useEffect(() => {
    console.log("a");
    if (ref.current) {
      console.log("b");
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
}
