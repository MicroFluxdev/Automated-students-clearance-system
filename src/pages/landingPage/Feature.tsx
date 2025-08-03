import {
  FileCheck,
  Clock,
  Shield,
  Users,
  BarChart3,
  Smartphone,
} from "lucide-react";

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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Powerful Features for
            <span className="text-blue-600"> Modern Education</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform transforms how educational institutions
            handle student administrative processes, making them faster, more
            accurate, and completely transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
