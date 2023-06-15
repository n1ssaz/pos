import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginContainer, MainContainer, NewOrder, Products, Settings, Users, Profile, Orders, Logout } from './pages'


export const Router = () =>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<MainContainer />} >
                <Route index element={<Navigate to='/newOrder' />} />
                <Route path='newOrder' element={<NewOrder />} />
                <Route path='products' element={<Products />} />
                <Route path='orders' element={<Orders />} />
                <Route path='users' element={<Users />} />
                <Route path='profile' element={<Profile />} />
                <Route path='logout' element={<Logout />} />
            </Route>
            <Route path='/settings' element={<Settings />} />
            <Route path='/login' element={<LoginContainer />} />
            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    </BrowserRouter>
