 
 import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function NavbarComponent() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1>pro connect</h1>

        <div className={styles.navBarOptionsContiner}>
          <div
            className={styles.buttonJoin}
            onClick={() => router.push("/login")}
          >
            <p>Be a part</p>
          </div>
        </div>
      </nav>
    </div>
  );
}