import React from "react";
import { Modal } from "antd";
import { Lock, CheckCircle } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onOk: () => void;
  role: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onOk,
  role,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
}) => {
  const isError = role === "student";

  return (
    <Modal
      open={isOpen}
      onOk={onOk}
      okText="Okay"
      centered
      footer={null}
      closable={false}
      style={{
        borderRadius: 24,
        maxWidth: 400,
      }}
      styles={{
        body: {
          padding: "2.5rem 2rem 2rem 2rem",
          borderRadius: "1.25rem",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        },
        mask: {
          background: "rgba(30, 41, 59, 0.25)",
          backdropFilter: "blur(2px)",
        },
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex items-center justify-center rounded-full shadow-lg mb-4 ${
            isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          }`}
          style={{
            width: 64,
            height: 64,
            marginBottom: "1.25rem",
            boxShadow: isError
              ? "0 4px 16px 0 rgba(239, 68, 68, 0.15)"
              : "0 4px 16px 0 rgba(34, 197, 94, 0.15)",
          }}
        >
          {isError ? <Lock size={36} /> : <CheckCircle size={36} />}
        </div>
        <h2
          className={`font-semibold text-2xl mb-2 ${
            isError ? "text-red-600" : "text-green-700"
          }`}
        >
          {isError ? errorTitle : successTitle}
        </h2>
        <p
          className={`text-base sm:text-lg mb-6 ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {isError ? errorMessage : successMessage}
        </p>
        <button
          onClick={onOk}
          className={`w-full py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${
            isError
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          style={{
            fontSize: "1rem",
            letterSpacing: "0.01em",
          }}
        >
          Okay
        </button>
      </div>
    </Modal>
  );
};

export default StatusModal;
