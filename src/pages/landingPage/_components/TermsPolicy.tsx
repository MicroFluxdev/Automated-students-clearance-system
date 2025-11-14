import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const TermsPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-10 transition-all duration-300">

        <div className="flex justify-center mb-6">
          <div
            className="h-16 w-16 bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('public/sign/MICRO FLUX ico.png')",
            }}
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Terms and Privacy Policy
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Please read these terms carefully before using our service.
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to our website. By accessing or using our service, you agree
              to comply with and be bound by the following terms and conditions.
              Please read them carefully before using our site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              2. Use of Our Service
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to use this service only for lawful purposes. You must not
              use it in any way that could harm, disable, or impair the website or
              interfere with others’ use.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              3. Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We value your privacy. Any information collected through our website
              is used to provide and improve our services. We do not share your
              personal data with third parties except as required by law or with
              your consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              4. Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may use cookies to enhance user experience. You can
              choose to disable cookies through your browser settings, but some
              parts of the site may not function properly as a result.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              5. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content, designs, and materials on this site are owned or
              licensed by us. You may not copy, distribute, or reuse any part of
              this site without permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              6. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms and Privacy Policy from time to time.
              Updates will be posted on this page with the revised date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              7. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms or our Privacy Policy,
              please contact us at {" "}
              <a
                href="https://www.facebook.com/MicroFluxOfficialPage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Microflux
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-gray-500 mb-6">
            Automated Student Clerance System
          </p>
          <Link to={"/register"}><Button>Back</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPolicy;
