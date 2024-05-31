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
import { AddUser } from './Component/AdminComponent/AddUser.jsx'
import { RegisteredPage } from './Pages/RegisteredPage.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
  },
  {
    path:"RegisterPage",
    element: <RegisteredPage/>,
  },
  {
    path:"AdminPage",
    element: <AdminPage/>,
  },
  {
    path:"UserManagement",
    element: <UserManagement/>,
  },
  {
    path:"add",
    element: <AddUser/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
