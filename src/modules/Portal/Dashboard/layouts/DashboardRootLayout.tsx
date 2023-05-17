import styles from "../SideNavBar.module.css";

import { Outlet } from "react-router-dom";
import SideNavBar from "../SideNavBar";
import TopNavBar from "../TopNavBar";
import { useEffect, useState } from "react";

import adminButtons from "../userwiseButtonsData/adminButtons";
import companyButtons from "../userwiseButtonsData/companyButtons";
import userButtons from "../userwiseButtonsData/userButtons";

const DashboardRootLayout = (props: { component?: any }) => {
  // const [opacity, setOpacity] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userType, setuserType] = useState('');

  useEffect(() => {

    // TODO: check if user is admin or not for real
    setuserType('admin');

    if (
      localStorage.getItem("userInfo") &&
      JSON.parse(localStorage.getItem("userInfo")!).exist_in_guild
    ) {
      setConnected(JSON.parse(localStorage.getItem("userInfo")!).exist_in_guild);
    }
  });

  const buttons = [];

  switch (userType) {
    case "admin":
      buttons.push(...adminButtons);
      break;
    case "company":
      buttons.push(...companyButtons);
      break;
    case "user":
      buttons.push(...userButtons);
  }

  if (!connected) {
    buttons.splice(1, 0, {
      url: "connect-discord",
      title: "Connect Discord",
      icon: <i className="fi fi-sr-data-transfer"></i>,
    });
  }

  return (
    <div className={styles.full_page}>
      <SideNavBar sidebarButtons={buttons} />
      <div className={styles.right_side}>
        <TopNavBar />
        <div className={styles.main_content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardRootLayout;