import './style/App.css'
import Login from './pages/Login'
import Success from './pages/Success'
import Course from './pages/course'
import Class from './pages/Class'
import Seat from './pages/Seat' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/success",
      element: <Success />,
    },
    {
      path: "/course",
      element: <Course />
    },
    {
      path: "/class",
      element: <Class />
    },
    {
      path: "/class/seat",
      element: <Seat />
    }
  ])
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
