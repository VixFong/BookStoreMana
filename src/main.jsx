import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { AdminPage } from './Pages/AdminPage.jsx'
import{
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import { UserManagement } from './Component/AdminComponent/UserManagement.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
  },
  {
    path:"AdminPage",
    element: <AdminPage/>,
  },
  {
    path:"UserManagement",
    element: <UserManagement/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
