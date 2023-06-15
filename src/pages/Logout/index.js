import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Actions from '../../Store/Actions'
import { useSelector } from 'react-redux'
import API from '../../api'

export const Logout = () => {
    const { auth: { user } } = useSelector((state) => state)
    useEffect(() => {
        API.get(`users/logout/${user._id}`).then(() => {
            localStorage.removeItem('isLogged')
            localStorage.removeItem('userid')
            Actions.setLogOut()
            Actions.setUser({})
            window.location.reload()
        })
    }, [])
    return null
}