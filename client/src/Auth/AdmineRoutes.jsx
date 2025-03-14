import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';

const AdmineRoutes = () => {
    console.log('enter admin page')
    const [role, setRole] = useState('');
    
        useEffect(() => {
            fetchRole();
        }, []);
    
        const fetchRole = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/role');
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data && data.length > 0) {
                        setRole(data[0].role);
                    }
                    console.log('Fetched role:', data[0]?.role);
                }
            } catch (error) {
                console.error("Error loading role:", error);
            }
        }
        console.log(`role from privetrout page is : ${role}`)
        if (role === 'admin'){
            <Outlet/>
        } else {
            <Navigate to='/login'/>
        }
}

export default AdmineRoutes