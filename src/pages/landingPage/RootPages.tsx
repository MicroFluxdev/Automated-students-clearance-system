import About from "./About";
import CallToAction from "./CallToAction";
import Features from "./Feature";
import Hero from "./Home";
import Testimonials from "./Testimonials";

const RootPages = () => {
  return (
    <div className="min-h-screen font-inter">
      <Hero />
      <Features />
      <About />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default RootPages;
