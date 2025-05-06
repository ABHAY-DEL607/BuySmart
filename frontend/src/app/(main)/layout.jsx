import Navbar from '@/components/navbar';
import React from 'react'


const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Layout;