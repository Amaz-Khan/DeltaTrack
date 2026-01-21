import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Spin, Result, Button, Space } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";
import apiClient from "../services/apiClient";

const SignupVerify = () => {
  const { "*": pathTokens } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifySignup = async () => {
      if (!pathTokens) {
        setStatus("error");
        setErrorMessage("Invalid verification link - no token found");
        return;
      }

      // URL format: /signup-verify/{accessToken}/{refreshToken}
      const tokenParts = pathTokens.split("/").filter(Boolean);
      const accessToken = tokenParts[0];

      if (!accessToken) {
        setStatus("error");
        setErrorMessage("Invalid verification link - missing access token");
        return;
      }

      try {
        // Create a fresh axios instance to avoid interceptor adding old tokens
        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/auth/sign-up/confirm`,
          {
            method: "GET",
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        console.log("Verification response:", response.status, data);

        if (response.ok) {
          setStatus("success");
        } else {
          throw { response: { data, status: response.status } };
        }
      } catch (e: any) {
        console.error("Verification error:", e.response?.data || e);

        const errorData = e.response?.data;

        // Check if token expired
        if (
          errorData?.error?.name === "TokenExpiredError" ||
          errorData?.error?.message?.includes("expired") ||
          errorData?.message?.includes("expired")
        ) {
          setStatus("expired");
          setErrorMessage(
            "Your verification link has expired. Please sign up again to receive a new link.",
          );
        } else {
          setStatus("error");
          setErrorMessage(
            errorData?.error?.message ||
              errorData?.message ||
              "Verification failed. Please try again.",
          );
        }
      }
    };

    verifySignup();
  }, [pathTokens]);

  return (
    <PageTransition>
      <Row
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
        }}
        align="middle"
        justify="center"
      >
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            {status === "loading" && (
              <div style={{ padding: 40 }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Verifying your account...</p>
              </div>
            )}

            {status === "success" && (
              <Result
                status="success"
                title="Email Verified!"
                subTitle="Your account has been verified successfully."
                extra={
                  <Button type="primary" onClick={() => navigate("/login")}>
                    Go to Login
                  </Button>
                }
              />
            )}

            {status === "error" && (
              <Result
                status="error"
                title="Verification Failed"
                subTitle={errorMessage}
                extra={
                  <Button type="primary" onClick={() => navigate("/signup")}>
                    Try Again
                  </Button>
                }
              />
            )}

            {status === "expired" && (
              <Result
                status="warning"
                title="Link Expired"
                subTitle="Your verification link has expired. Please sign up again to receive a new verification email."
                extra={
                  <Space>
                    <Button type="primary" onClick={() => navigate("/signup")}>
                      Sign Up Again
                    </Button>
                    <Button onClick={() => navigate("/login")}>
                      Go to Login
                    </Button>
                  </Space>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </PageTransition>
  );
};

export default SignupVerify;
