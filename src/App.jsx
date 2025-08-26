import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hero from './components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Hero />
            {/* add more sections later */}
            <section id="projects" className="min-h-[60vh]" />
            <section id="about" className="min-h-[60vh]" />
            <section id="contact" className="min-h-[60vh]" />
    </>
  )
}

export default App
