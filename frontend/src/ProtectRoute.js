import React from 'react'
import { Navigate } from 'react-router-dom'
import {useSelector} from "react-redux"

const ProtectRoute = ({ component: Component, ...rest }) => {
    const { loading, isAuthenticated } = useSelector(state => state.user)
    if (loading === false) {
        if (isAuthenticated === false) {
            return <Navigate to="/signin" />
        }
        return <Component />
    }
    return <Navigate to="/" />
}

export default ProtectRoute