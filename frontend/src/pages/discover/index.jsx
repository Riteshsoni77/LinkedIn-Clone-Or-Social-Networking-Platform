import UserLayout from "@/layout/UserLayout";
import { DashboardLayout } from "@/layout/DashbaardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUser } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function Discoverpage() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    
    useEffect(() => {

        if (!authState.all_profiles_fetched) {

        dispatch( getAllUser());
        }
    },[]);



    
  

    
    return (
        <UserLayout>
            <DashboardLayout>

                <div>
                    <h1>discover</h1>
                    <div className="allUsersProfile"> 

                        {authState.all_users.map((user) => {
                            return (
                                <div
                                 onClick={() => router.push(`/view_profile/${user.userId.username}`)}   
                                 key={user._id} className={styles.userCard}>
                             
                                        <img  className={styles.userCard_image}
                                        src={ `${BASE_URL}/${user.userId.profilePicture}` } alt="profile" />
                                  
                                    <div className={styles.userProfileCardDetails}>

                                        
                                        <h3>{user.userId.name}</h3>
                                        <p>{user.userId.username}</p>
                                      
                                        
                                    </div>
                                </div>
                            )
                        })} 

                    </div>

                     
                </div>
            </DashboardLayout>


        </UserLayout>

    )
}