"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  return (
    <nav className={styles.navbar}>
      {/* Left Section: Application Name */}
      <div className={styles.navbarLeft}>
        <Link href='/'><h1>ProfileMapper</h1></Link>
      </div>

      {/* Right Section */}
      <div className={styles.navbarRight}>
        {session ? (
          <>
            {/* User Info */}
            <div className={styles.userInfo}>
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className={styles.profileImg}
              />
              <p className={styles.userName}>{session.user.name}</p>
            </div>

            {/* Admin Button */}
            {isAdmin && (
              <Link href="/AddUser" className={styles.addUserLink}>
                Add User
              </Link>
            )}

            {/* Logout Button */}
            <button onClick={() => signOut()} className={styles.authButton}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => signIn("google")} className={styles.authButton}>
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
