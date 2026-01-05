import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Form, Input, Button, Typography } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";

const { Text } = Typography;

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    setTimeout(() => {
      console.log("Password reset email sent to:", values.email);
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <PageTransition>
        <Row
          style={{ minHeight: "100vh", background: "#f5f7fa" }}
          align="middle"
          justify="center"
        >
          <Col xs={22} sm={16} md={12} lg={8}>
            <Card
              title={
                <span style={{ fontSize: 20, fontWeight: 600 }}>
                  Forgot Password
                </span>
              }
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Text type="secondary">
                Enter your email and we’ll send you a link to reset your
                password.
              </Text>

              {!submitted ? (
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  style={{ marginTop: 24 }}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input size="large" placeholder="you@example.com" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                    >
                      Send Reset Link
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ textAlign: "center" }}>
                    <Link to="/login">Back to Login</Link>
                  </Form.Item>
                </Form>
              ) : (
                <div
                  style={{
                    marginTop: 24,
                    textAlign: "center",
                    opacity: 0,
                    animation: "fadeIn 0.5s forwards",
                  }}
                >
                  <h3>Check your inbox!</h3>
                  <p>We’ve sent a password reset link to your email.</p>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </PageTransition>
    </>
  );
};

export default ForgotPassword;
