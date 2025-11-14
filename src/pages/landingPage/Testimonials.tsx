import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Salman",
    role: "Graphic Designer",
    institution: "North Central Mindanao College",
    avatar: "/placeholder.svg",
    content:
      "ASCS provides a clean and intuitive interface that makes student clearance simple and visually engaging.",
    rating: 5,
  },
  {
    name: "Anthony",
    role: "Software Developer",
    institution: "North Central Mindanao College",
    avatar: "/placeholder.svg",
    content:
      "Built by our software developers, ASCS delivers fast, secure, and reliable automation to streamline student clearance processes.",
    rating: 5,
  },
  {
    name: "Cawasa",
    role: "Analyst",
    institution: "North Central Mindanao College",
    avatar: "/placeholder.svg",
    content:
      "With insights from our finance director, ASCS ensures cost-effective operations and transparent tracking of institutional resources.",
    rating: 5,
  },
  {
    name: "Cawasa",
    role: "Analyst",
    institution: "North Central Mindanao College",
    avatar: "/placeholder.svg",
    content:
      "With insights from our finance director, ASCS ensures cost-effective operations and transparent tracking of institutional resources.",
    rating: 5,
  },
  {
    name: "Cawasa",
    role: "Analyst",
    institution: "North Central Mindanao College",
    avatar: "/placeholder.svg",
    content:
      "With insights from our finance director, ASCS ensures cost-effective operations and transparent tracking of institutional resources.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const totalSlides = testimonials.length;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section id="testimonials" className="py-20 bg-gray-100 lg:px-30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.2 },
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
            Leveraging Microflux's expertise, the Automated Student Clearance
            System (ASCS) is making significant impacts across campuses.
            Institutions, faculty, and students trust ASCS to streamline the
            clearance process, minimize errors, and enhance overall efficiency.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.6 } },
          }}
        >
          <Carousel
            opts={{ align: "start", loop: false }} // loop: false to enable arrow disable
            setApi={setApi}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    className="bg-white rounded-xl border border-gray-200 shadow-sm h-full"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="p-6 h-full flex flex-col">
                      {/* Rating */}
                      <motion.div
                        className="flex items-center gap-1 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      >
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
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
                            >
                              <path d="M12 .587l3.668 7.571L24 9.748l-6 5.854 1.42 8.281L12 18.896l-7.42 4.987L6 15.602 0 9.748l8.332-1.59z" />
                            </motion.svg>
                          )
                        )}
                      </motion.div>

                      {/* Content */}
                      <motion.blockquote
                        className="text-gray-800 mb-6 leading-relaxed flex-grow"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      >
                        "{testimonial.content}"
                      </motion.blockquote>

                      {/* Author */}
                      <motion.div
                        className="flex items-center gap-4 mt-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                      >
                        <motion.div
                          className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold relative flex-shrink-0"
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
                              ((e.target as HTMLImageElement).style.display =
                                "none")
                            }
                          />
                          <span className="absolute">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <motion.div
                            className="font-semibold text-gray-900 truncate"
                            whileHover={{ scale: 1.05 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            {testimonial.name}
                          </motion.div>
                          <div className="text-sm text-gray-600 truncate">
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
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Arrows with Disable */}
            <CarouselPrevious
              disabled={currentSlide === 0}
              className={`-left-4 md:-left-12 bg-white/90 hover:bg-white border-gray-300 shadow-lg z-10 ${
                currentSlide === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <CarouselNext
              disabled={currentSlide >= totalSlides - 1}
              className={`-right-4 md:-right-12 bg-white/90 hover:bg-white border-gray-300 shadow-lg z-10 ${
                currentSlide >= totalSlides - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
