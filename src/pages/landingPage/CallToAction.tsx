import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden lg:px-30">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            Ready to Transform Your
            <motion.span
              className="block"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                },
              }}
            >
              Student Administration?
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
              },
            }}
          >
            Be part of the growing number of institutions transforming manual clearance into
            a seamless, paperless experience.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12 text-white/90"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.6,
                },
              },
            }}
          >
            {["Ease of Access", "24/7 Operation", "Zero Setup Hassle"].map(
              (text, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  whileHover={{ scale: 1.1, color: "white" }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                  <span>{text}</span>
                </motion.div>
              )
            )}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
              },
            }}
          >

            <a href="https://www.facebook.com/MicroFluxOfficialPage" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="px-12 py-4 text-lg bg-white/20 border border-white/30 text-white rounded-md font-semibold"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderColor: "rgba(255,255,255,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Contact Us
              </motion.button>
            </a>

          </motion.div>

          <motion.p
            className="mt-8 text-white/70"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 1 },
              },
            }}
          >
            Message us on our Facebook Page:{" "}
            <motion.span
              className="font-semibold"
              whileHover={{ scale: 1.05, color: "white" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              MicroFlux
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
