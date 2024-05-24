import { BestSelling } from "./Component/BestSelling";
import { Carousel } from "./Component/Carousel"
import { Heading } from "./Component/Heading"


export const App = () => {
  return (
    <div>
      <Heading/>
      <Carousel/>
      <BestSelling/>
    </div>
  );
};