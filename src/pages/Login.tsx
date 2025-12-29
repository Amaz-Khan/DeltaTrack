import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Form, Input, Button } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";
import Navbar from "../components/Navbar/Navbar";

const Login = () => {
  const [loading, setLoading] = useState(false);


  const onFinish = (values: any) => {
    setLoading(true);

    setTimeout(() => {
      console.log("Form Values", values);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Navbar />
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
              <Form layout="vertical" onFinish={onFinish}>
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
