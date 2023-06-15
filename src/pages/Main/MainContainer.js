import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Tabs } from "antd";
import { useSelector } from "react-redux";

const menuItems = (user) => [
    {
        key: '/newOrder',
        label: `Fature e re`,
        children: <Outlet />
    },
    user.perm_products && {
        key: '/products',
        label: `Produktet`,
        children: <Outlet />
    },
    user.perm_settings && {
        key: '/settings',
        label: `Settings`,
        children: <Outlet />
    },
    user.perm_transactions && {
        key: '/orders',
        label: `Faturat`,
        children: <Outlet />
    },
    user.perm_users && {
        key: '/users',
        label: `Perdoruesit`,
        children: <Outlet />
    },
    {
        key: '/profile',
        label: `Profili`,
        children: <Outlet />
    },
    {
        key: '/logout',
        label: `Dil`,
        children: <Outlet />
    },
];
export const MainContainer = () => {
    const navigate = useNavigate()
    const { isLogged, user, settings } = useSelector((state) => state.auth)
    if (!isLogged && !Object.keys(user)?.length) return <Navigate to='/login' />
    if (settings !== false && !settings._id) return <Navigate to='/settings' />

    return <div className="main-container">
        <Tabs className="main-tabs" items={menuItems(user)} onChange={navigate} />
    </div>
}