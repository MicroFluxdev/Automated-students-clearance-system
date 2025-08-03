import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center lg:px-30 justify-center overflow-hidden pt-16 bg-black text-white">
      {/* Gradient background using Tailwind plugin or custom CSS class */}
      <div className="absolute inset-0 bg-gradient-hero"></div>

      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://ncmc.edu.ph/img/home_cover.jpg')`,
        }}
      ></div>

      {/* Floating blurred circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Automate Your
            <span className="block bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
              Student Management
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Streamline student clearance, document processing, and
            administrative workflows with our intelligent automation platform.
          </p>

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Get Started Today Button */}
            <Link to="/login">
              <button className="flex items-center justify-center px-8 py-3 text-lg border border-white text-white hover:bg-white hover:text-black transition duration-200 rounded-lg">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>

            {/* Watch Demo Button */}
            <Link to="/register">
              <button className="flex items-center justify-center px-8 py-3 text-lg bg-blue-700 text-white hover:bg-blue-800 transition duration-200 rounded-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Metrics */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>99% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>500+ Institutions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
