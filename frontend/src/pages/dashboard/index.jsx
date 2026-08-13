import { useRouter } from "next/router";
import { useEffect, useState } from "react";






export default function Dashboard() {


    const routeter = useRouter();

    const [istokenThere, setistokenThere] = useState(false);    

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            routeter.push('/login')
        }
        setistokenThere(true)

    });

    useEffect(() => {
       if (istokenThere) {
            routeter.push('/dashboard')
        }

    });


     
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}