import { CheckCircle, ArrowRight } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text & Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Transforming Education
                <span className="text-blue-600"> Administration</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                StudentFlow revolutionizes how educational institutions manage
                student processes. Our automated system eliminates bureaucratic
                bottlenecks, reduces manual errors, and creates a seamless
                experience for both students and administrators.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-md text-base font-medium flex items-center justify-center hover:bg-blue-700 transition">
                Learn More About Our Solution
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md text-base font-medium hover:bg-gray-100 transition">
                Schedule a Demo
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-white/80">Educational Institutions</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">1M+</div>
                    <div className="text-white/80 text-sm">Students Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-white/80 text-sm">Uptime SLA</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">80%</div>
                    <div className="text-white/80 text-sm">
                      Faster Processing
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-white/80 text-sm">
                      Support Available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Blurs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
