import About from "./About";
import CallToAction from "./CallToAction";
import Features from "./Feature";
import Hero from "./Home";
import MobilePage from "./MobilePage";
import Testimonials from "./Testimonials";

const RootPages = () => {
  return (
    <div className="min-h-screen font-inter">
      <Hero />
      <Features />
      <About />
      <MobilePage />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default RootPages;
