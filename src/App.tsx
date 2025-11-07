import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CircularsProvider } from './context/CircularsContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AllCirculars from './pages/AllCirculars'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CircularsProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="circulars" element={<AllCirculars />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </CircularsProvider>
    </AuthProvider>
  )
}

export default App
