import { Routes, Route } from 'react-router-dom'
import { Dashboard, Auth } from '@/layouts'

function App () {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" render={null} />
    </Routes>
  )
}

export default App
