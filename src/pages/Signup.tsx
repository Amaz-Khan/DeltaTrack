import { useState } from "react";
import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Input, Button, message } from "antd";
import PageTransition from "../components/PageTransition/PageTransition";
import apiClient, { SignupPayload } from "../services/apiClient";

const Signup: FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);

    const payload: SignupPayload = {
      username: values.email.split("@")[0],
      email: values.email,
      password: values.password,
      role: "user",
    };

    try {
      await apiClient.post("/auth/sign-up", payload);
      message.success("Check your email to verify your signup!");
      form.resetFields();
      navigate("/login");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || "Signup failed";
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
                  Create your account
                </span>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                validateTrigger="onBlur"
              >
                {/*Email Field*/}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email address!" },
                  ]}
                >
                  <Input size="large" placeholder="Enter your email" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Password is required" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password size="large" placeholder="Enter Password" />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" placeholder="Confirm Password" />
                </Form.Item>

                {/* Submit */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                  <span>
                    Already have an account? <Link to="/login">Login</Link>
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

export default Signup;
