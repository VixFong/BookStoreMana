import React from 'react'
import Sidebar from '../Component/AdminComponent/SideBar';
import OnTheWayList from '../Component/AdminComponent/OnTheWayList'

export const OnTheWay = () => {
    return (
        <div className="d-flex">
            <Sidebar/>
            <div className="content-container flex-grow-1">
              <OnTheWayList/>
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
