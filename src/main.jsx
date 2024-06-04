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
import { AddUser } from './Pages/AddUser.jsx'
import { RegisteredPage } from './Pages/RegisteredPage.jsx'
import { ForgotPass } from './Pages/ForgotPass.jsx'
import { UpdatePass } from './Pages/UpdatePass.jsx'
import { EditUser } from './Pages/EditUser.jsx'
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
    path:"ForgotPass",
    element: <ForgotPass/>,
  },
  {
    path:"UpdatePass",
    element: <UpdatePass/>,
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
  {
    path:"edit",
    element: <EditUser/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
