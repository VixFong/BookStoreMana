import { Heading } from "./Component/Heading"
import { Carousel } from "./Component/Carousel"
import { BestSelling } from "./Component/BestSelling";
import{ FeaturedBooks } from "./Component/FeaturedBooks";
import{ Banner } from "./Component/Banner";


export const App = () => {
  return (
    <div>
      <Heading/>
      <Carousel/>
      <BestSelling/>
      <FeaturedBooks/>
      <Banner/>
    </div>
  );
};
