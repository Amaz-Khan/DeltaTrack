import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Spin, Result, Button } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";
import apiClient from "../services/apiClient";

const SignupVerify = () => {
  const { "*": tokens } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifySignup = async () => {
      if (!tokens) {
        setStatus("error");
        setErrorMessage("Invalid verification link");
        return;
      }

      const tokenParts = tokens.split("/").filter(Boolean);
      const accessToken = tokenParts[0];

      try {
        await apiClient.get("/auth/sign-up/confirm", {
          headers: {
            Authorization: accessToken,
          },
        });
        setStatus("success");
      } catch (e: any) {
        setStatus("error");
        setErrorMessage(
          e.response?.data?.message || e.message || "Verification failed"
        );
      }
    };

    verifySignup();
  }, [tokens]);

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
          </Card>
        </Col>
      </Row>
    </PageTransition>
  );
};

export default SignupVerify;
