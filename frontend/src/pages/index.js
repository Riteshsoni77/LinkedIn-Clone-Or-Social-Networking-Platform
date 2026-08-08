import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className="mainContainer">
        <div className="mainContainer_left">
          <p>Connect with friends without exaggeration</p>
          <p>A true social media platform, with stories no bluffs!</p>

          <div
            onClick={() => router.push("/login")}
            className="buttonJoin"
          >
            <p>Join Now</p>
          </div>
        </div>

        <div className="mainContainer_right">
          <img src="/images/connect2.png" alt="Home" />
        </div>
      </div>
    </div>
  );
}
