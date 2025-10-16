import {
  FileCheck,
  Clock,
  Shield,
  Users,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileCheck,
    title: "Digital Document Processing",
    description:
      "Automated clearance forms, digital signatures, and instant document verification. Eliminate paperwork and reduce processing time by 80%.",
    badge: "Core Feature",
  },
  {
    icon: Clock,
    title: "Real-time Status Tracking",
    description:
      "Students and administrators can track clearance status in real-time. Get instant notifications when documents are approved or require attention.",
    badge: "Popular",
  },
  {
    icon: Shield,
    title: "Secure Data Management",
    description:
      "Bank-grade encryption ensures student data is protected. Compliant with FERPA and other educational data privacy regulations.",
    badge: "Secure",
  },
  {
    icon: Users,
    title: "Multi-role Access Control",
    description:
      "Customizable permission levels for students, faculty, and administrators. Each role sees only relevant information and functions.",
    badge: "Flexible",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Comprehensive dashboards with insights into clearance bottlenecks, completion rates, and system performance metrics.",
    badge: "Insights",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Fully responsive interface works seamlessly on desktop, tablet, and mobile devices. Access your clearance status anywhere, anytime.",
    badge: "Mobile Ready",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-100 lg:px-30">
      <div className="container mx-auto px-4">
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
            Powerful Features for
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
              Modern Education
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
            Our comprehensive platform transforms how educational institutions
            handle student administrative processes, making them faster, more
            accurate, and completely transparent.
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
                staggerChildren: 0.15,
                delayChildren: 0.6,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300"
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
              <motion.div
                className="flex items-start justify-between mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <motion.div
                  className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: "#dbeafe",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </motion.div>
                </motion.div>
                <motion.span
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#e5e7eb",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {feature.badge}
                </motion.span>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
