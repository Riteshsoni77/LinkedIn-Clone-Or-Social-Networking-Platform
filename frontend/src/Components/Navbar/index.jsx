 
 import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { reset } from "@/config/redux/reducer/authreducer";

export default function NavbarComponent() {
  const router = useRouter();

  const dispatch = useDispatch();


  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1>pro connect</h1>

        <div className={styles.navBarOptionsContiner}>

          {authState.profileFetched && <div>

            <div style={{ display: "flex", gap: "1.2rem" }}>
            <p> hey {authState.user.userId.name} </p>
            <p style={{fontWeight: "bold", cursor: "pointer"}}>profile </p>
            <p 
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
              dispatch(reset());
            }}
            style={{fontWeight: "bold", cursor: "pointer"}} >logout</p>
             </div>

          </div>}
          {!authState.profileFetched && 
             
          <div
            className={styles.buttonJoin}
            onClick={() => router.push("/login")}
          >
            <p>Be a part</p>
          </div>}
        </div>
      </nav>
    </div>
  );
}