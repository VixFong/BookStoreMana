import { Heading } from "./Component/Heading"
import { Carousel } from "./Component/Carousel"
import { BestSelling } from "./Component/BestSelling";
import{ FeaturedBooks } from "./Component/FeaturedBooks";
import{ Banner } from "./Component/Banner";
import { WhyChooseUs } from "./Component/WhyChooseUs";
import { Authors } from "./Component/Authors";
import { Footer } from "./Component/Footer";
// import PrivateRoute from './components/PrivateRoute';
// import UserManagement from './page/UserManagement';
import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { UserProvider } from './Context/UserContext';
// import { AuthProvider } from './Context/AuthContext';
// import Login from './page/Login';

// import NotFound from "./Component/NotFound";

// export const App = () => {
//   return (
//     <AuthProvider>
//       <UserProvider>
//       {/* <Router> */}
//         <div>
//           <Heading />
//           <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="/" element={<PrivateRoute />}/>
//             <Route path="/userManagement" element={<UserManagement />} />
            
//             <Route path="/" element={
//               <>
//                 <Carousel />
//                 <BestSelling />
//                 <FeaturedBooks />
//                 <Banner />
//                 <WhyChooseUs />
//                 <Authors />
//               </>
//             } />
//           </Routes>
//           <Footer />
//         </div>
//       {/* </Router> */}
//       </UserProvider>
//     </AuthProvider>
//   );
// };

// export default App;

export const App = () => {
  return (
    <div>
      <Heading/>
      <Carousel/>
      <BestSelling/>
      <FeaturedBooks/>
      <Banner/>
      <WhyChooseUs/>
      <Authors/>
      <Footer/>
    </div>
  );
};

// export const App = () => {
//   return (
//       <Router>
//           <div>
//               <Heading />
//               {/* <Switch> */}
//                   <Route exact path="/">
//                       <Carousel />
//                       <BestSelling />
//                       <FeaturedBooks />
//                       <Banner />
//                       <WhyChooseUs />
//                       <Authors />
//                       <Footer />
//                   </Route>
          
//                   <Route path="*">
//                       <NotFound />
//                   </Route>
//               {/* </Switch> */}
//           </div>
//       </Router>
//   );
// };

