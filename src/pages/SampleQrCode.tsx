// src/components/QRCodeGenerator.tsx

import React, { useState } from 'react';

interface Permit {
  id: string;
  userId: string;
  permitCode: string;
  expiresAt: string;
  status: string;
  createdAt: string;
}

interface QRResponse {
  message: string;
  permit: Permit;
  qrImage: string;
  token: string;
}

const SampleQrCode: React.FC = () => {
  const [data, setData] = useState<QRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = "68873263511467aa98fc2ea8"; // You can make this dynamic if needed

  const handleGenerateQR = async () => {
    try {
      const response = await fetch(`http://localhost:8080/qr-code/generate-qr/${userId}`, {
        method: 'POST',
        credentials: 'include' // If you're using cookies/sessions
      });

      if (!response.ok) {
        throw new Error("Failed to fetch QR code data");
      }

      const json: QRResponse = await response.json();
      setData(json);
      setError(null);
      localStorage.setItem("jwtToken", json.token);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold">Signed for Clearance Cleared</h1>
      <button
        onClick={handleGenerateQR}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" 
      >
        Generate QR Code
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="mt-8">
          <h2 className="text-2xl">{data.message}</h2>
          <ul className="list-disc list-inside">
            <li><strong>Permit Code:</strong> {data.permit.permitCode}</li>
            <li><strong>Status:</strong> {data.permit.status}</li>
            <li><strong>Expires At:</strong> {new Date(data.permit.expiresAt).toLocaleString()}</li>
            <li><strong>Created At:</strong> {new Date(data.permit.createdAt).toLocaleString()}</li>
          </ul>
          <h3 className="text-2xl mt-4">QR Code:</h3>
          <img
            src={data.qrImage}
            alt="QR Code"
            width={200}
            height={200}
            className="border border-gray-300 rounded-md"
          />
          {/* <h3 className="text-2xl">JWT Token:</h3>
          <code className="bg-gray-100 p-4 rounded-md">
            {data.token}
          </code> */}
        </div>
      )}
    </div>
  );
};

export default SampleQrCode;
