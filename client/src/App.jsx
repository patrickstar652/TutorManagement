import './style/App.css'
import Login from './pages/Login'
import Success from './pages/Success'
import Course from './pages/course'
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
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
