import React from 'react'
import DashboardManagement from '../Component/AdminComponent/DashboardManagement'
import Sidebar from '../Component/AdminComponent/SideBar';

export const Dashboard = () => {
    return (
        <div className="d-flex">
            <Sidebar/>
            <div className="content-container flex-grow-1">
              <DashboardManagement/>
            </div>
        </div>
      );
    }
    
    // Add some basic styling to ensure proper layout
    const styles = `
      .content-container {
        padding: 5px;
        margin-left: 10px;
        flex-grow:1;
      }
    `;
    
    // Inject the styles into the page
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
