import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="relative bg-white">
      <img
        className="absolute inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full opacity-25 sm:opacity-100"
        src="/ncmc-logo1.png"
        alt="ncmc-logo"
      />
      <div className="hidden sm:block sm:inset-0 sm:absolute sm:bg-gradient-to-r sm:from-white sm:to-transparent"></div>
      <div className="relative max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Welcome to the
            <strong className="font-extrabold text-rose-700 sm:block">
              NCMC Online Clearance
            </strong>
          </h1>
          <p className="max-w-lg mt-4 sm:leading-relaxed sm:text-xl">
            Streamline your clearance process with our efficient and easy-to-use
            online platform. Get cleared from anywhere, anytime.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 text-center">
            <Link
              to="/login"
              className="block w-full px-12 py-3 text-sm font-medium text-white rounded shadow bg-rose-600 sm:w-auto active:bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="block w-full px-12 py-3 text-sm font-medium bg-white rounded shadow text-rose-600 sm:w-auto hover:text-rose-700 active:text-rose-500 focus:outline-none focus:ring"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
