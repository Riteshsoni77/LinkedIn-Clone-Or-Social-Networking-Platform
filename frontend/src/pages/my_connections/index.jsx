import { DashboardLayout } from "@/layout/DashbaardLayout";
import UserLayout from "@/layout/UserLayout";
import { useEffect } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { acceptConnectionRequest, getMyConnectionRequests } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnections() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authstate = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if (authstate.connectionRequests?.length !== 0) {
      console.log(authstate.connectionRequests);
    }
  }, [authstate.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem"}}>
          <h1>My Connections</h1>

          {authstate.connectionRequest.length === 0 ? (
            <h1>No connections exist.</h1>
          ) : (
            authstate.connectionRequest.filter((connection) => connection.status_accepted === null).map((user) => {
            return (

              <div 

               onClick={() => router.push(`/view_profile/${user.userId.username}`)} 
              className={styles.userCard} key={user._id}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" ,justifyContent: "space-between" }}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile Picture" />
                  </div>

                  <div className={styles.userInfo}>

                    <h3>{user.userId.name}</h3>
                    <p>{user.userId.username}     </p>
                  </div>

                   <button onClick={ async(e)=>{ e.stopPropagation(); 
                     await dispatch(acceptConnectionRequest({
                      connectionId:user._id,
                      token:localStorage.getItem("token"),
                      action:"accept"


                     }));
                   }} className={styles.connectButton}> Accept</button>

                </div>



              </div>


            );
            })
          )}

            <h4> My Network</h4>
          {authstate.connectionRequest.filter((connection) => connection.status_accepted === true).map((user) => {
            return (

              <div 

               onClick={() => router.push(`/view_profile/${user.userId.username}`)} 
              className={styles.userCard} key={user._id}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" ,justifyContent: "space-between" }}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile Picture" />
                  </div>

                  <div className={styles.userInfo}>

                    <h3>{user.userId.name}</h3>
                    <p>{user.userId.username}     </p>
                  </div>


                </div>



              </div>
            )


          })}

        </div>
      </DashboardLayout>
    </UserLayout>
  );
}