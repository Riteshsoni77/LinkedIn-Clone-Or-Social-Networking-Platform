import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>Connect with Friends without Exaggeration</p>
          <p>A true social media platform, with stories no bluffs!</p>

          <div
            className={styles.buttonJoin}
            onClick={() => router.push("/login")}
          >
            Join Now
          </div>
        </div>

        <div className={styles.mainContainer_right}>
          <img src="/images/connect2.png" alt="Home" />
        </div>
      </div>
    </div>
   </UserLayout>
    
  );
}
