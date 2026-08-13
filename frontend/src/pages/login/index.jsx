import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'

import style from "./style.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { loginuser, registerUser } from '@/config/redux/action/authAction'
import { emptymessage } from '@/config/redux/reducer/authreducer'

export default function LoginComponent() {


  const authState = useSelector((state) => state.auth)

  const routeter = useRouter();
  const [userloginmethod, setuserloginmethod] = useState(true);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {

    if (authState.loggedIn) {
      routeter.push('/dashboard')
    }

  }, [authState.loggedIn]);

  useEffect(() => {
    if(localStorage.getItem("token")){
      routeter.push('/dashboard')
    }
  }, []);

  useEffect(() => {
    dispatch( emptymessage() )
  }, [userloginmethod]);


  const handleRegister = () => {


    dispatch(registerUser({ name, email, password, username }))
  }

  const handleLogin = () => {
    dispatch(loginuser({ email, password }))
  }



  return (

    <UserLayout>


      <div className={style.container}>

        <div className={style.cardContainer}>

          <div className={style.cardContainer_Left}>

            <p className={style.cardleft_hadding}> {userloginmethod ? "sign in" : "sign up"} </p>

            <p style={{ color: authState.iserror ? 'red' : 'green' }}>{authState.message.message}</p>
            <div className={style.inputContainer}>

              {userloginmethod ? <></> : (
                <div className={style.inputRow}>
                  <input onChange={(e) => setUsername(e.target.value)} className={style.inputField} placeholder='Username' type="text" />
                  <input onChange={(e) => setName(e.target.value)} className={style.inputField} placeholder='Name' type="text" />
                </div>
              )}

              <input onChange={(e) => setEmail(e.target.value)} className={style.inputField} placeholder='Email' type="email" />

              <input onChange={(e) => setPassword(e.target.value)} className={style.inputField} placeholder='Password' type="password" />


              <div
                onClick={userloginmethod ? handleLogin : handleRegister}
                className={style.buttonwithoutline}>
                <p> {userloginmethod ? "sign in" : "sign up"} </p>
              </div>


            </div>


          </div>


          <div className={style.cardContainer_Right}>

            {userloginmethod ? <p>dont have an account ? </p> : <p>already have an account ? </p>}
            <p  className={style.buttonwithline} onClick={() => setuserloginmethod(!userloginmethod)}> {userloginmethod ? "sign up" : "sign in"} </p>  


          </div>



        </div>
      </div>



    </UserLayout>


  )
}
