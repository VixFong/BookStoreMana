import React from 'react';
import { CategoryManagement } from '../Component/AdminComponent/CateManagement';
import { Sidebar } from '../Component/AdminComponent/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthorManagement from '../Component/AdminComponent/AuthorManagement';

export const Category = () => {
  return (
    <div className="d-flex">
        <Sidebar/>
        <div className="content-container flex-grow-1">
          <CategoryManagement/>
        </div>
        <div className="hello-container">
          <AuthorManagement/>  
        </div>
    </div>
  );
}

// Add some basic styling to ensure proper layout
const styles = `
  .content-container {
    padding: 5px;
    margin-left: 10px;
  }
  .hello-container {
    padding: 5px;
    margin-left: 200px;
  }
  @media (max-width: 2000px) {
    .content-container {
      margin-left: 10px; 
    }
  }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);