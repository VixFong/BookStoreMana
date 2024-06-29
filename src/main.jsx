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
import { DetailPage } from './Pages/DetailPage.jsx'
import { Inventory } from './Pages/Inventory.jsx'
import { AddInventory } from './Pages/AddInventory.jsx'
import { CategoryCli } from './Pages/CategoryCli.jsx'
import { DaftOrder } from './Pages/DaftOrder.jsx'
import { AddPurchase } from './Pages/AddPurchase.jsx'
import { OnTheWay } from './Pages/OnTheWay.jsx'
import { OTWEdit } from './Pages/OTWEdit.jsx'

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
        path: 'BookDetail',
        element: <DetailPage/>,
    },
    {
        path: 'CategoryClient',
        element: <CategoryCli/>,
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
        path: 'editproduct/:bookId',
        element: (
            <ProtectedRoute>
                <EditProduct />
            </ProtectedRoute>
        ),
    },
    {
        path: 'inventory',
        element: (
            <ProtectedRoute>
                <Inventory/>
            </ProtectedRoute>
        ),
    },
    {
        path: 'addinventory',
        element: (
            <ProtectedRoute>
                <AddInventory/>
            </ProtectedRoute>
        ),
    },
    {
        path: 'daftorder',
        element: (
            <ProtectedRoute>
                <DaftOrder/>
            </ProtectedRoute>
        ),
    },
    {
        path: 'addpurchase',
        element: (
            <ProtectedRoute>
                <AddPurchase/>
            </ProtectedRoute>
        ),
    },
    {
        path: 'ontheway',
        element: (
            <ProtectedRoute>
                <OnTheWay/>
            </ProtectedRoute>
        ),
    },
    {
        path: 'onthewayedit',
        element: (
            <ProtectedRoute>
                <OTWEdit/>
            </ProtectedRoute>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
        <RouterProvider router={router} />
);