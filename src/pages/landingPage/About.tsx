import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Reduce processing time by up to 80%",
  "Eliminate paper-based workflows entirely",
  "Improve student satisfaction with transparency",
  "Streamline administrative operations",
  "Ensure compliance with educational standards",
  "Scale efficiently as your institution grows",
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-white lg:px-30">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {/* Text & Benefits */}
          <motion.div
            className="space-y-8"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
          >
            <div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
              >
                Transforming Education
                <motion.span
                  className="text-blue-600"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.2,
                      },
                    },
                  }}
                >
                  {" "}
                  Administration
                </motion.span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 leading-relaxed mb-8"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
                  },
                }}
              >
                ASCS revolutionizes how educational institutions manage student clearance. 
                Our automated platform eliminates bottlenecks, reduces manual errors, and provides a seamless, 
                transparent experience for both students and administrative staff.
              </motion.p>
            </div>

            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.5,
                  },
                },
              }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  </motion.div>
                  <span className="text-gray-800">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
                },
              }}
            >
              <motion.button
                className="px-8 py-3 bg-blue-600 text-white rounded-md text-base font-medium flex items-center justify-center hover:bg-blue-700 transition"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Learn More
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="relative"
            variants={{
              hidden: { opacity: 0, x: 50, rotateY: 15 },
              visible: {
                opacity: 1,
                x: 0,
                rotateY: 0,
                transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
              },
            }}
            whileHover={{
              scale: 1.02,
              rotateY: -2,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg"
              whileHover={{
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)",
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.6,
                    },
                  },
                }}
              >
                <motion.div
                  className="text-center"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: "easeOut" },
                    },
                  }}
                >
                  <motion.div
                    className="text-4xl font-bold"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.8,
                    }}
                  >
                    ASCS
                  </motion.div>
                  <div className="text-white/80">Highlights</div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4 text-center"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.8,
                      },
                    },
                  }}
                >
                  {[
                    { number: "80%", label: "Reduce Processing Time" },
                    { number: "90%", label: "Eliminates Manual Clearance" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5, ease: "easeOut" },
                        },
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <motion.div
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 1 + index * 0.1,
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4 text-center"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 1,
                      },
                    },
                  }}
                >
                  {[
                    { number: "27001", label: "GDPR compliant" },
                    { number: "24/7", label: "Support Available" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5, ease: "easeOut" },
                        },
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <motion.div
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 1.2 + index * 0.1,
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Decorative Blurs */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
