import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Input, Button, message } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";
import apiClient from "../services/apiClient";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const { accessToken, refreshToken, user } = response.data;
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
      }
      if (user) {
        setUser(user);
      }
      message.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || "Login failed";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              title={
                <span style={{ fontSize: 20, fontWeight: 600 }}>
                  Welcome back
                </span>
              }
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Form
                layout="vertical"
                onFinish={onFinish}
                validateTrigger="onBlur"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input size="large" placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Enter your password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Login
                  </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center", marginBottom: 16 }}>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                  <span>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                  </span>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </PageTransition>
    </>
  );
};

export default Login;
