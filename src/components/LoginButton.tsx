import ClipLoader from "react-spinners/ClipLoader";

interface LoginButtonProps {
  isLoading: boolean;
  type: "submit" | "button";
  text?: string;
}

const LoginButton = ({ isLoading, type, text }: LoginButtonProps) => {
  return (
    <div>
      <button
        type={type}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2.5 sm:py-2 px-4 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:from-blue-700 hover:to-blue-500 transition duration-200 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? <ClipLoader color="#fff" size={22} /> : text}
      </button>
    </div>
  );
};

export default LoginButton;
