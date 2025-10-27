import { Loader2 } from "lucide-react";

const LogoutLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-xl w-[280px] animate-fadeIn">
        {/* Image / Logo */}
        <img
          src="/MICRO FLUX ico.png" 
          alt="App Logo"
          className="w-16 h-16 object-contain mx-auto"
        />

        {/* Loader Icon */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />

        {/* Text Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Logging out...
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we sign you out
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutLoadingOverlay;
