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
import { Administrators } from './Pages/Administrators.jsx'
import { Category } from './Pages/Category.jsx'
import { Product } from './Pages/Product.jsx'
import { AddProduct } from './Pages/AddProduct.jsx'
import { EditProduct } from './Pages/EditProduct.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'

  const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: 'RegisterPage',
        element: <RegisteredPage />,
    },
    {
        path: 'ForgotPass',
        element: <ForgotPass />,
    },
    {
        path: 'UpdatePass',
        element: <UpdatePass />,
    },
    {
        path: 'AdminPage',
        element: (
            <ProtectedRoute>
                <AdminPage />
            </ProtectedRoute>
        ),
    },
    {
        path: 'UserManagement',
        element: (
            <ProtectedRoute>
                <UserManagement />
            </ProtectedRoute>
        ),
    },
    {
        path: 'add',
        element: (
            <ProtectedRoute>
                <AddUser />
            </ProtectedRoute>
        ),
    },
    {
        path: '/edit/:userId',
        element: (
            <ProtectedRoute>
                <EditUser />
            </ProtectedRoute>
        ),
    },
    {
        path: 'administrators',
        element: (
            <ProtectedRoute>
                <Administrators />
            </ProtectedRoute>
        ),
    },
    {
        path: 'category',
        element: (
            <ProtectedRoute>
                <Category />
            </ProtectedRoute>
        ),
    },
    {
        path: 'product',
        element: (
            <ProtectedRoute>
                <Product />
            </ProtectedRoute>
        ),
    },
    {
        path: 'addproduct',
        element: (
            <ProtectedRoute>
                <AddProduct />
            </ProtectedRoute>
        ),
    },
    {
        path: 'editproduct/:id',
        element: (
            <ProtectedRoute>
                <EditProduct />
            </ProtectedRoute>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
        <RouterProvider router={router} />
);