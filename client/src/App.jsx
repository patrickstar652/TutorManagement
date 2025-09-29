import './style/App.css'
import Login from './pages/Login'
import Success from './pages/Success'
import Course from './pages/Course'
import Class from './pages/Class'
import Seat from './pages/Seat' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/success",
      element: (
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      ),
    },
    {
      path: "/course",
      element: (
        <ProtectedRoute>
          <Course />
        </ProtectedRoute>
      )
    },
    {
      path: "/class",
      element: (
        <ProtectedRoute>
          <Class />
        </ProtectedRoute>
      )
    },
    {
      path: "/class/seat/:scheduleId",
      element: (
        <ProtectedRoute>
          <Seat />
        </ProtectedRoute>
      )
    },
    {
      path: "/login",
      element: <Login />
    },
  ])
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
