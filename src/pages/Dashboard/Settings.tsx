import { Typography, Form, Input, Button, Card, message } from "antd";

const { Title } = Typography;

const Settings = () => {
  const onFinish = (values: any) => {
    console.log("Settings:", values);
    message.success("Settings saved successfully!");
  };

  return (
    <div>
      <Title level={3}>Settings</Title>

      <Card title="Profile Settings" style={{ marginTop: 24, maxWidth: 600 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Display Name" name="displayName">
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter your email" disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
