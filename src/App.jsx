import { Heading } from "./Component/Heading"
import { Carousel } from "./Component/Carousel"
import { BestSelling } from "./Component/BestSelling";
import{ FeaturedBooks } from "./Component/FeaturedBooks";
import{ Banner } from "./Component/Banner";
import { WhyChooseUs } from "./Component/WhyChooseUs";
import { Authors } from "./Component/Authors";


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
    </div>
  );
};
