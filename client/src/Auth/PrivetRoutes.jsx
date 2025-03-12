import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = {role: 'user'}
    console.log(auth)
    return (
        auth.role == 'user' ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoutes