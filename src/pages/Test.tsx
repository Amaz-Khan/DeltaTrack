import { useEffect, useState } from "react";
import apiClient, { ApiResponse, SignupPayload } from "../services/apiClient";

const TestSignup = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const payload: SignupPayload = {
        username: `user_${Math.floor(Math.random() * 10000)}`,
        email: `test_${Date.now()}@example.com`,
        password: "securePassword123",
        verified: {},
        role: "user",
      };

      const response = await apiClient.post<ApiResponse<any>>(
        "/auth/sign-up",
        payload
      );

      setData(response.data);
    } catch (e: any) {
      const message =
        e.response?.data?.message || e.message || "Request failed";
      setError(message);
      console.error("Full Error Detail:", e.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Backend Connection Test</h2>
      <p>Target: {import.meta.env.VITE_APP_BASE_URL}/auth/sign-up</p>

      <button
        onClick={runTest}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Testing..." : "Execute Sign-Up Test"}
      </button>

      <hr />

      {error && (
        <div
          style={{ color: "red", backgroundColor: "#ffebeb", padding: "10px" }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div
          style={{
            color: "green",
            backgroundColor: "#ebffeb",
            padding: "10px",
          }}
        >
          <strong>Success! Backend Responded:</strong>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestSignup;
