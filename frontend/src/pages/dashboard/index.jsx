import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";




export default function Dashboard() {

 
    const routeter = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)

    const [istokenThere, setistokenThere] = useState(false);    

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            routeter.push('/login')
        }
        setistokenThere(true)

    });

    useEffect(() => {
       if (istokenThere) {
            dispatch(getAllPosts())
            dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        }

    },[istokenThere]);


    


     
    return (

        <UserLayout>
    <div>
        {authState.profileFetched && authState.user && (
            <div>
                hey {authState.user.userId.name}
            </div>
        )}
    </div>

    </UserLayout>
);
}