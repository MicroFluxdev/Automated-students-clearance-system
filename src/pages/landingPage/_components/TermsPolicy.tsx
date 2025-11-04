


import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

export const TermsPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">Terms and Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to our website. By accessing or using our service, you agree to
          comply with and be bound by the following terms and conditions. Please
          read them carefully before using our site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Use of Our Service</h2>
        <p>
          You agree to use this service only for lawful purposes. You must not use
          it in any way that could harm, disable, or impair the website or interfere
          with others’ use.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Privacy Policy</h2>
        <p>
          We value your privacy. Any information collected through our website is
          used to provide and improve our services. We do not share your personal
          data with third parties except as required by law or with your consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
        <p>
          Our website may use cookies to enhance user experience. You can choose to
          disable cookies through your browser settings, but some parts of the site
          may not function properly as a result.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
        <p>
          All content, designs, and materials on this site are owned or licensed by
          us. You may not copy, distribute, or reuse any part of this site without
          permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Changes to These Terms</h2>
        <p>
          We may update these Terms and Privacy Policy from time to time. Updates
          will be posted on this page with the revised date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
        <p>
          If you have any questions about these Terms or our Privacy Policy, please
          contact us at{" "}
          <a href="mailto:info@example.com" className="text-blue-600 underline">
            info@example.com
          </a>.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8 text-center">
        Last updated: November 2025
      </p>
      <Link to={"/register"}><Button>Back</Button></Link>
    </div>
  );
};

export default TermsPolicy;
