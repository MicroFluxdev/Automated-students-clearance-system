import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center lg:px-30 justify-center overflow-hidden pt-16 bg-black text-white"
    >
      {/* Gradient background using Tailwind plugin or custom CSS class */}
      <motion.div
        className="absolute inset-0 bg-gradient-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      ></motion.div>

      {/* Background image overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://ncmc.edu.ph/img/home_cover.jpg')`,
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 3, ease: "easeOut" }}
      ></motion.div>

      {/* Floating blurred circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5,
              },
            },
          }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            Automated Student
            <motion.span
              className="block bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 1, ease: "easeOut", delay: 0.2 },
                },
              }}
            >
              Clearance System
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            Streamline student clearance, document processing, and
            administrative workflows with our intelligent automation platform.
          </motion.p>

          {/* Call to actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            {/* Get Started Today Button */}
            <Link to="/login">
              <motion.button
                className="flex items-center justify-center px-8 py-3 text-lg border border-white text-white hover:bg-white hover:text-black transition duration-200 rounded-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Login Portal
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </motion.button>
            </Link>

            {/* Watch Demo Button */}
            <Link to="/register">
              <motion.button
                className="flex items-center justify-center px-8 py-3 text-lg bg-blue-700 text-white hover:bg-blue-800 transition duration-200 rounded-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Play className="mr-2 h-5 w-5" />
                </motion.div>
                Watch Demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Metrics */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 text-white/80"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 1.5,
                },
              },
            }}
          >
            {[
              { text: "99% Uptime", delay: 0 },
              { text: "500+ Institutions", delay: 0.1 },
              { text: "24/7 Support", delay: 0.2 },
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: metric.delay,
                    },
                  },
                }}
                whileHover={{ scale: 1.1, color: "white" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: metric.delay,
                  }}
                ></motion.div>
                <span>{metric.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
