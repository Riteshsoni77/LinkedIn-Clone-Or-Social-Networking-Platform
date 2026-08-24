
import { DashboardLayout } from "@/layout/DashbaardLayout";
import UserLayout from "@/layout/UserLayout";

import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { resetPostid } from "@/config/redux/reducer/postreducer";



export default function profilePage() {



    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
    const [inputData, setInputData] = useState({
        company: "",
        position: "",
        years: ""
    });

    const  handleWorkInputChange=(e)=>{
       setInputData({
        ...inputData,
        [e.target.name]: e.target.value
     

       })
          console.log(inputData);
        

    }


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

    const updateProfileData = async () => {

        const request = await clientServer.post('/user_update', {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,

        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPosition: userProfile.currentPosition,
            postWork: userProfile.postWork,
            education: userProfile.education,


        })



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
                                        {/* <h2>{userProfile.userId.name}</h2> */}
                                        <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })} />

                                        <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                                    </div>


                                    <div>
                                        <textarea
                                            value={userProfile.bio}
                                            onChange={(e) => {
                                                setUserProfile({ ...userProfile, bio: e.target.value });
                                            }}
                                            rows={Math.max(3, userProfile.bio.length / 80)}
                                            style={{ width: "100%" }}
                                        />


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

                                <button className={styles.addWorkButton} onClick={() => {

                                    setIsModalOpen(true);
                                    setIsWorkModalOpen(true);

                                }}>  Add Work </button>


                            </div>



                            


                        </div>

                        <div className={styles.educationHistory} >

                            <h4> Education History</h4>
                            <div className={styles.educationHistoryContainer}>
                                {userProfile.education.map((educaion, index) => {
                                    return (
                                        <div key={index} className={styles.educationHistoryCard}>
                                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }} >{educaion.School}-{educaion.degree}

                                            </p>

                                            <p>{educaion.fieldOfStudy}</p>

                                        </div>

                                    )
                                })}

                                <button className={styles.addEducaionButton} onClick={() => {

                                    setIsModalOpen(true);
                                    setIsEducationModalOpen(true);

                                }}>  Add Education </button>


                            </div>
                            </div>


                        {userProfile != authState.user &&
                            <div onClick={
                                () => {
                                    updateProfileData();
                                }
                            } className={styles.connectionButton}>

                                Update Profile

                            </div>

                        }

                    </div>
                }
               

                {isModalOpen && isWorkModalOpen  &&

                    <div

                        onClick={() => {

                            setIsModalOpen(false);
                            dispatch(resetPostid());

                        }}

                        className={styles.commentsContainer}>



                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={styles.AllCommentsContainer}>

                            <input name="company" onChange={  handleWorkInputChange} className={styles.inputField} placeholder='Enter company name' type=" text" />
                            <input name="position" onChange={  handleWorkInputChange} className={styles.inputField} placeholder=' Enter position' type="text" />
                            <input name="years" onChange={  handleWorkInputChange} className={styles.inputField} placeholder='Enter years of experience' type="number" />

                            <div onClick={()=>{
                                 setUserProfile({
                                   ...userProfile,
                                   postWork: [...userProfile.postWork, inputData]   
                                 })
                                 setIsModalOpen(false);
                                 

                            }} className={styles.connectionButton} > 
                                 Add Work
                            </div>


                        </div>

                    </div>
                   

                }


                {isModalOpen && isEducationModalOpen  &&

                    <div

                        onClick={() => {

                            setIsModalOpen(false);
                            dispatch(resetPostid());

                        }}

                        className={styles.commentsContainer}>



                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={styles.AllCommentsContainer}>

                            <input name="school" onChange={  handleWorkInputChange} className={styles.inputField} placeholder='Enter school name' type="text" />
                            <input name="degree" onChange={ handleWorkInputChange} className={styles.inputField} placeholder='Enter degree' type="text" />
                            <input name="fieldOfStudy" onChange={  handleWorkInputChange} className={styles.inputField} placeholder='Enter field of study' type="text" />
                           
                            <div onClick={()=>{
                                 setUserProfile({
                                   ...userProfile,
                                   education: [...userProfile.  education, inputData]   
                                 })
                                 setIsModalOpen(false);
                                 

                            }} className={styles.connectionButton} > 
                                 Add Work
                            </div>


                        </div>

                    </div>
                   

                }

                
               

            </DashboardLayout>
        </UserLayout>

    );
}