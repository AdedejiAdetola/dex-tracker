import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DexTrackerDashboard from './components/DexTrackerDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DexTrackerDashboard />
    </>
  )
}

export default App
