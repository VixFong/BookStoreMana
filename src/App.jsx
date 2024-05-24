import { BestSelling } from "./Component/BestSelling";
import { Carousel } from "./Component/Carousel"
import{ FeaturedBooks } from "./Component/FeaturedBooks";
import { Heading } from "./Component/Heading"


export const App = () => {
  return (
    <div>
      <Heading/>
      <Carousel/>
      <BestSelling/>
      <FeaturedBooks/>
    </div>
  );
};
