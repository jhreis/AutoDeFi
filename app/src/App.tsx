import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("test")
  }, [])

  return <div>WHAT?</div>
}