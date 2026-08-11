import NavbarComponent from '@/Components/Navbar';
import React from 'react';
 export default function UserLayout({children}){
    return (
        <div className="user-layout">
           <NavbarComponent />

            {children}
          
            
        </div>
        )
}
