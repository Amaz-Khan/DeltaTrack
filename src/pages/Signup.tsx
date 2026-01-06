import { useState } from 'react';
import {Link } from 'react-router-dom';
import {Row, Col, Card, Form, Input, Button} from 'antd';
import PageTransition from '../components/PageTransition/PageTransition';
import Navbar from '../components/Navbar/Navbar';

import { useDispatch, useSelector } from "react-redux";
import type  { RootState, AppDispatch } from "../app/store";
import { startLoading, stopLoading } from "../features/auth/authSlice";

const Signup: React.FC = () => {
//     const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

//     const onFinish = (values: any) => {
//         setLoading(true);

//         setTimeout(() => {
//             console.log('Form Values', values);
//             setLoading(false);
//         }, 2000);
//   };

const dispatch = useDispatch<AppDispatch>();
const loading = useSelector((state: RootState) => state.auth.loading);

const onFinish = (values: any) => {
  dispatch(startLoading());

  setTimeout(() => {
    console.log("Form Values", values);
    dispatch(stopLoading());
  }, 2000);
};

    return (
        <>
        <Navbar/>
        <PageTransition>
        <Row 
        style={{
            minHeight: '100vh',
            background: '#f5f7fa'
            }}
        align="middle"
        justify="center"
        >
            <Col xs={22} sm={16} md={12} lg={8}>
            <Card 
            title={<span style={{ fontSize: 20, fontWeight: 600 }}>Create your account</span>}
            >
                <Form
                form={form} 
                layout="vertical" 
                onFinish={onFinish}
                >
                    {/*Email Field*/}
                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: 'Email is required'},
                        {type: 'email', message: 'Enter a valid email address!'}
                    ]}
                    >
                        <Input size="large" placeholder="Enter your email" />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {required: true, message: 'Password is required'},
                        {min: 6, message: 'Password must be at least 6 characters long'}
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
                        {required: true, message: 'Please confirm your password!'},
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if(!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Passwords do not match!')
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

                    <Form.Item style={{textAlign: 'center'}}>
                        <span>
                            Already have an account?{' '}
                        <Link to="/login">
                            Login
                        </Link>
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