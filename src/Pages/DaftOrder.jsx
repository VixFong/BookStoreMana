import React from 'react'
import Sidebar from '../Component/AdminComponent/SideBar';
import PurchaseOrder from '../Component/AdminComponent/PurchaseOrder';
import NotificationBell from '../Component/AdminComponent/NotificationBell';

export const DaftOrder = () => {
    return (
        <div className="d-flex">
            <Sidebar/>
            <div className="content-container flex-grow-1">
              <PurchaseOrder/>
              <NotificationBell/>
            </div>
        </div>
    );
}

const styles = `
  .content-container {
    padding: 5px;
    margin-left: 10px;
  }

  @media (max-width: 2000px) {
    .content-container {
      margin-left: 50px; 
    }
  }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);