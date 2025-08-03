import { ArrowRight, CheckCircle } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden lg:px-30">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span className="block">Student Administration?</span>
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Join hundreds of institutions already using StudentFlow to
            streamline their processes and improve student satisfaction.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/90">
            {["Free 30-day trial", "No setup fees", "Cancel anytime"].map(
              (text, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{text}</span>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-12 py-4 text-lg bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-transform duration-200 rounded-md font-semibold shadow-md flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <button className="px-12 py-4 text-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors duration-200 rounded-md font-semibold">
              Contact Sales
            </button>
          </div>

          <p className="mt-8 text-white/70">
            Questions? Call us at{" "}
            <span className="font-semibold">(555) 123-4567</span> or email{" "}
            <span className="font-semibold">hello@studentflow.com</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
