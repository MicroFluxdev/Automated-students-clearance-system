import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  GraduationCap,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-white border-t border-gray-200 text-gray-700 lg:px-30"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                StudentFlow
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Transforming educational administration through intelligent
              automation and seamless digital experiences.
            </p>
            <div className="flex gap-4">
              <button className="p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition">
                <Facebook className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Product</h3>
            <div className="space-y-2">
              {[
                "Features",
                "Pricing",
                "Integrations",
                "API Documentation",
                "Security",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-500 hover:text-blue-600 transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Company</h3>
            <div className="space-y-2">
              {[
                "About Us",
                "Careers",
                "News & Blog",
                "Case Studies",
                "Partners",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-500 hover:text-blue-600 transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>hello@studentflow.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="my-8 border-t border-gray-200" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500">
            © 2024 StudentFlow. All rights reserved.
          </div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
