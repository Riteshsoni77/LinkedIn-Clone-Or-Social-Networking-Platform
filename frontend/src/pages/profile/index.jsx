
import { DashboardLayout } from "@/layout/DashbaardLayout";
import UserLayout from "@/layout/UserLayout";

import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";



export default function profilePage() {



    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts());
    }, [])


    useEffect(() => {

        const username = authState.user?.userId?.username || authState.user?.username;

        if (!username) {
            setUserProfile({});
            setUserPosts([]);
            return;
        }

        setUserProfile(authState.user);

        const post = (postReducer.posts || []).filter((post) => {
            return post?.userId?.username === username;
        });

        setUserPosts(post);

    }, [authState.user, postReducer.posts]);

    const updateProfilePicture = async (file) => {
      
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('token', localStorage.getItem("token"));


            const response = await clientServer.post('/update_profile_picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(getAboutUser({ token: localStorage.getItem("token") }));


       


    }



    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile.userId &&

                    <div className={styles.container}>
                        <div className={styles.backDropContainer}>
                            <label htmlFor="profilePictureUpload" className={styles.backderop_overlay}>
                                edit

                            </label>
                            <input
                                onChange={(e) => {
                                    updateProfilePicture(e.target.files[0]);
                                }} hidden type="file" id="profilePictureUpload" />

                            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />


                        </div>
                        <div className={styles.profileContainer_datils}>

                            <div style={{ display: "flex", gap: "1.7rem" }}>

                                <div style={{ flex: 0.8 }}>
                                    <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                                        <h2>{userProfile.userId.name}</h2>
                                        <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                                    </div>


                                    <div>
                                        <p> {userProfile.bio}</p>
                                    </div>


                                </div>

                                <div style={{ flex: 0.2 }}>
                                    <h3>Recent Activity</h3>
                                    {userPosts.map((post) => {
                                        return (
                                            <div key={post._id} className={styles.PostCard}>
                                                <div className={styles.card}>
                                                    <div className={styles.card__profileContainer}>
                                                        {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="Post media" /> : <div style={{ width: "3.4rem", height: "3.4rem", borderRadius: "50%", }}></div>}
                                                    </div>
                                                    <p> {post.body} </p>

                                                </div>

                                            </div>
                                        )
                                    })
                                    }


                                </div>

                            </div>


                        </div>

                        <div className={styles.workHistory} >

                            <h4> Work History</h4>
                            <div className={styles.workHistoryContainer}>
                                {userProfile.postWork.map((work, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }} >{work.company}-{work.position}

                                            </p>

                                            <p>{work.years}</p>

                                        </div>

                                    )
                                })}
                            </div>


                        </div>

                    </div>
                }

            </DashboardLayout>
        </UserLayout>

    );
}