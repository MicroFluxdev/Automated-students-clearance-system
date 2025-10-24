import { Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { FacebookFilled } from "@ant-design/icons";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      id="contact"
      className="bg-white border-t border-gray-200 text-gray-700 lg:px-30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="p-2 bg-blue-500 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  className="h-8 w-8 rounded-md object-cover"
                  src="/MICRO FLUX LOGO.png"
                  alt="Menu icon"
                />
              </motion.div>
              <span className="text-2xl font-bold text-gray-900">ASCS</span>
            </motion.div>
            <motion.p
              className="text-gray-500 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Transforming educational administration through intelligent
              automation and seamless digital experiences.
            </motion.p>
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { icon: Twitter, delay: 0.5 },
                { icon: Linkedin, delay: 0.6 },
                { icon: Facebook, delay: 0.7 },
              ].map(({ icon: Icon, delay }) => (
                <motion.button
                  key={delay}
                  className="p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.h3
              className="font-semibold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Product
            </motion.h3>
            <div className="space-y-2">
              {[
                "Features",
                "Pricing",
                "Integrations",
                "API Documentation",
                "Security",
              ].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="block text-gray-500 hover:text-blue-600 transition"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.h3
              className="font-semibold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Institutions
            </motion.h3>
            <div className="space-y-2">
              {[
                "About Us",
                "Careers",
                "News & Blog",
                "Case Studies",
                "Partners",
              ].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="block text-gray-500 hover:text-blue-600 transition"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.h3
              className="font-semibold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Contact
            </motion.h3>
            <div className="space-y-3">
              {[
                { icon: FacebookFilled, text: "MicroFlux", delay: 0.3 },
                { icon: Phone, text: "+639100734410", delay: 0.4 },
                { icon: MapPin, text: "Lanao del Norte, Philippines", delay: 0.5 },
              ].map(({ icon: Icon, text, delay }) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-3 text-gray-500"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Separator */}
        <motion.div
          className="my-8 border-t border-gray-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Footer Bottom */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            className="text-gray-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            © 2024 MicroFlu. All rights reserved.
          </motion.div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.05 }}
                >
                  {item}
                </motion.a>
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
