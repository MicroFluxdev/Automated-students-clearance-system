import React from "react";

const spinnerStyle: React.CSSProperties = {
  width: "64px",
  height: "64px",
  border: "8px solid #e0e7ef",
  borderTop: "8px solid #2563eb",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
};

const screenStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const textStyle: React.CSSProperties = {
  marginTop: "2rem",
  fontSize: "1.5rem",
  color: "#2563eb",
  fontWeight: 600,
  letterSpacing: "0.05em",
  fontFamily: "Inter, sans-serif",
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

const ScreenLoading: React.FC = () => (
  <div style={screenStyle}>
    <style>{keyframes}</style>
    <div style={spinnerStyle}></div>
    <div style={textStyle}>Loading, please wait...</div>
  </div>
);

export default ScreenLoading;
