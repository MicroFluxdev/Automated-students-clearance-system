import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Sarah Martinez",
    role: "Dean of Student Affairs",
    institution: "University of California",
    avatar: "/placeholder.svg",
    content:
      "StudentFlow has completely transformed our clearance process. What used to take weeks now takes just days. Our students are happier, and our staff is more efficient.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Senior Student",
    institution: "MIT",
    avatar: "/placeholder.svg",
    content:
      "As a graduating student, I can't imagine going through clearance the old way. Everything is transparent, fast, and I always know exactly what I need to do next.",
    rating: 5,
  },
  {
    name: "Prof. Emily Johnson",
    role: "Registrar",
    institution: "Stanford University",
    avatar: "/placeholder.svg",
    content:
      "The analytics and reporting features give us insights we never had before. We can identify bottlenecks and improve our processes continuously.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-100 lg:px-30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
              },
            },
          }}
        >
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
            Powered by
            <motion.span
              className="text-blue-600"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                },
              }}
            >
              {" "}
              MicroFlux
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
              },
            }}
          >
            Leveraging Microflux's expertise, the Automated Student Clearance System (ASCS) 
            is making significant impacts across campuses. Institutions, faculty, and students 
            trust ASCS to streamline the clearance process, minimize errors, and enhance overall efficiency.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm"
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                  },
                },
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-6">
                <motion.div
                  className="flex items-center gap-1 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-yellow-400"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: 0.9 + index * 0.1 + i * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotate: 10,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        },
                      }}
                    >
                      <path d="M12 .587l3.668 7.571L24 9.748l-6 5.854 1.42 8.281L12 18.896l-7.42 4.987L6 15.602 0 9.748l8.332-1.59z" />
                    </motion.svg>
                  ))}
                </motion.div>

                <motion.blockquote
                  className="text-gray-800 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  "{testimonial.content}"
                </motion.blockquote>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold relative"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                    <span className="absolute">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </motion.div>

                  <div className="flex-1">
                    <motion.div
                      className="font-semibold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {testimonial.name}
                    </motion.div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <motion.div
                      className="mt-1 inline-block bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#d1d5db",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {testimonial.institution}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
