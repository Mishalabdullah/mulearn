import React, { useEffect, useState } from "react";
import styles from "./SideNavBar.module.css";
import MulearnBrand from "../assets/MulearnBrand";
import { useNavigate } from "react-router-dom";
// import companyLogo from "./assets/images/profile.png";
// import {
//   MdSettings,
//   MdNotifications,
// } from "react-icons/md";

const TopNavBar = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    useEffect(() => {
        if (
            localStorage.getItem("userInfo") &&
            JSON.parse(localStorage.getItem("userInfo")!).firstName
        ) {
            setName(JSON.parse(localStorage.getItem("userInfo")!).firstName);
            setProfilePic(JSON.parse(localStorage.getItem("userInfo")!).profilePic);
        }
    });
    return (
        <>
            <div className={styles.top_nav}>
                <div className={styles.nav}>
                    <div className={styles.nav_items}>
                        <div className={styles.greetings}>Hello, {name} 👋</div>

                        <div className={styles.mulearn_brand2}>
                            {/* <MulearnBrand /> */}
                        </div>
                        <div className={styles.menu}>
                            {/* <MdSettings style={{ fontSize: "30px" }} /> */}
                            {/* <MdNotifications style={{ fontSize: "30px" }} /> */}
                            <div className={styles.profile}>
                                <img
                                    onClick={() => {
                                        navigate("/profile");
                                    }}
                                    src={profilePic}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </>
    );
};

export default TopNavBar;