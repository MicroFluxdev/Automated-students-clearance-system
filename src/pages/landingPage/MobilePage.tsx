// StudentAppDownload.jsx
// Updated: Responsive implementation for all breakpoints (mobile-first, accessible, keyboard-friendly)

import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

// Helper for responsiveness and accessibility:
// - Mobile-first layout stacks vertically, phone mockup below content and CTAs
// - Switches to 2-column layout on md+ screens
// - Adapt height, paddings, and mockup sizing at each breakpoint
// - Buttons are large, keyboard accessible
// - QR code floats responsively

export default function StudentAppDownload() {
  return (
    <section id="download" className="w-full">
      <div className="min-h-[80vh] bg-gradient-to-b from-gray-100 to-white flex flex-col justify-center py-12 px-4 sm:py-16 md:py-20 lg:px-30">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center max-w-6xl mx-auto">
          {/* Left column: copy + CTAs */}
          <div className="space-y-6 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              An&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-rose-600">
                ASCS
              </span>
              &nbsp;App for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-teal-500 to-sky-400 ml-0 inline-block">
                North Central
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-teal-500 to-sky-400 ml-0 inline-block">
                Mindanao College
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Say goodbye to tiring manual procedures and hello to a more innovative way of getting cleared. Our system brings everything you need into one platform,
              from digital submissions to real-time status monitoring. Stay informed, stay organized, and finish your clearance without stress or delays.
            </p>

            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 sm:space-x-4 space-y-3 xs:space-y-0 w-full max-w-md">
              {/* iPhone (just link, App Store handles download) */}
              <a
                href="https://apps.apple.com/app/your-iphone-app-link" // replace with actual iPhone app link if available
                aria-label="Download for iPhone"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:scale-[1.03] active:scale-100 transition-transform text-base sm:text-lg w-full xs:w-auto justify-center"
                tabIndex={0}
              >
                <Apple className="w-5 h-5" aria-hidden="true" />
                Download for iPhone
              </a>

              {/* Android (direct APK download) */}
              <a
                href="https://release-assets.githubusercontent.com/github-production-release-asset/1055960089/d84948f2-4b47-4241-8f82-dd81618c6eeb?sp=r&sv=2018-11-09&sr=b&spr=https&se=2025-10-23T16%3A55%3A06Z&rscd=attachment%3B+filename%3DASCS-app.v1.0.0.apk&rsct=application%2Fvnd.android.package-archive&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2025-10-23T15%3A54%3A31Z&ske=2025-10-23T16%3A55%3A06Z&sks=b&skv=2018-11-09&sig=1iK6vp3pgMwuK6gD53oiSnGS1mm5x%2F%2Br8tHZtz8MPLI%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc2MTIzNzAzMCwibmJmIjoxNzYxMjM1MjMwLCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.r_mrngdjUDdPAGhS5QGOhHRvZGvccN9tc7Z1Vr7Ic3M&response-content-disposition=attachment%3B%20filename%3DASCS-app.v1.0.0.apk&response-content-type=application%2Fvnd.android.package-archive"
                download
                aria-label="Download for Android"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition text-base sm:text-lg w-full xs:w-auto justify-center"
                tabIndex={0}
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                Download for Android
              </a>
            </div>


            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full bg-green-400 block"
                  aria-hidden="true"
                />
                0 ★ (0 reviews)
              </span>
              <span className="hidden xs:inline">•</span>
              <span>Made by MicroFlux</span>
            </div>

            <div className="mt-3 md:mt-4 text-slate-500 text-sm max-w-md">
              <strong>Tip:</strong> Use the QR code on your phone to open the
              app store directly.
            </div>
          </div>

          {/* Right column: phone mockup */}
          <div className="flex items-center justify-center min-h-[300px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-[220px] sm:w-[250px] md:w-[300px] lg:w-[340px] flex-shrink-0"
            >
              {/* Decorative glowing background */}
              <div
                className="absolute -inset-3 sm:-inset-6 rounded-3xl blur-2xl sm:blur-3xl opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(34,211,238,0.16))",
                }}
              />

              {/* Phone frame */}
              <div
                className="relative rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-2xl overflow-hidden"
                style={{ borderRadius: "36px" }}
              >
                <div
                  className="h-[420px] sm:h-[530px] md:h-[620px] lg:h-[650px] w-full max-w-full flex items-center justify-center p-3 sm:p-4 md:p-6"
                  style={{ aspectRatio: "9/19.5" }}
                >
                  <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 flex animate-slide-x">
                      <div
                        className="min-w-full flex items-center justify-center bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('/landingpage/login.jpg')` }}
                      ></div>
                      <div
                        className="min-w-full flex items-center justify-center bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('/landingpage/home.jpg')` }}
                      ></div>
                      <div
                        className="min-w-full flex items-center justify-center bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: `url('/landingpage/qr1222.jpg')` }}
                      ></div>
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <div className="h-1 w-16 sm:w-24 rounded-full bg-slate-200/40" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating QR, adjusts size/offset for mobile vs desktop */}
              <div className="absolute -bottom-4 sm:-bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                <div className="bg-white rounded-xl shadow-md border-4 border-blue-500 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden flex items-center justify-center">
                  <img
                    src="/landingpage/qr2.jpg"
                    alt="ASCS QR Code"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tailwind CSS animation keyframes - no style leaks */}
        <style>{`
        @keyframes slide-x {
        0% { transform: translateX(0%); }
        25% { transform: translateX(0%); }
        33% { transform: translateX(-100%); }
        58% { transform: translateX(-100%); }
        66% { transform: translateX(-200%); }
        91% { transform: translateX(-200%); }
        100% { transform: translateX(0%); }
        }

        .animate-slide-x {
          animation: slide-x 12s linear infinite;
        }
        @media (max-width: 639px) {
          .sm\\:w-24 { width: 6rem !important; }
          .sm\\:h-16 { height: 4rem !important; }
          .sm\\:gap-4 { gap: 1rem !important; }
        }
      `}</style>
      </div>
    </section>
  );
}
