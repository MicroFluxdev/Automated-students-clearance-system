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
      title={
        <span
          className={`flex items-center gap-2 ${
            isError ? "text-red-600" : "text-green-700"
          }`}
        >
          {isError ? (
            <Lock className="inline-block" size={22} />
          ) : (
            <CheckCircle className="inline-block" size={22} />
          )}
          {isError ? errorTitle : successTitle}
        </span>
      }
      open={isOpen}
      onOk={onOk}
      okText="Okay"
      centered
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <p
        className={`text-base sm:text-lg ${
          isError ? "text-red-600" : "text-green-700"
        }`}
      >
        {isError ? errorMessage : successMessage}
      </p>
    </Modal>
  );
};

export default StatusModal;
