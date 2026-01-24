import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Steps,
  Typography,
  Card,
  message,
} from "antd";
import {
  RocketOutlined,
  KeyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";

const { Title, Text, Paragraph } = Typography;

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [createdApp, setCreatedApp] = useState<{
    name: string;
    projectKey: string;
  } | null>(null);
  const addApplication = useAppStore((state) => state.addApplication);
  const user = useAuthStore((state) => state.user);

  const generateProjectKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "DT_";
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue("projectKey", key);
  };

  const handleCreateProject = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // User is determined from auth token on the backend
      const response = await apiClient.post("/applications", {
        name: values.name,
        projectKey: values.projectKey,
      });

      console.log("Onboarding create project response:", response.data);

      const newApp = response.data;
      const appId = newApp.id ?? newApp._id ?? Date.now();

      addApplication({
        id: String(appId),
        name: newApp.name || values.name,
        projectKey:
          newApp.projectKey || newApp.project_key || values.projectKey,
      });

      setCreatedApp({
        name: newApp.name || values.name,
        projectKey:
          newApp.projectKey || newApp.project_key || values.projectKey,
      });
      message.success("Application created successfully!");
      setCurrentStep(1);
    } catch (e: any) {
      console.error("Failed to create application:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "Failed to create application";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  const steps = [
    {
      title: "Create Project",
      icon: <RocketOutlined />,
    },
    {
      title: "Get Started",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      width={600}
      centered
      maskClosable={false}
    >
      <div style={{ padding: "20px 0" }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 40 }}
        />

        {currentStep === 0 && (
          <div>
            <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
              Welcome to DeltaTrack!
            </Title>
            <Text
              type="secondary"
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Let's set up your first project to start tracking errors
            </Text>

            <Form form={form} layout="vertical">
              <Form.Item
                label="Project Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter a project name" },
                ]}
              >
                <Input size="large" placeholder="My Awesome App" />
              </Form.Item>

              <Form.Item
                label="Project Key"
                name="projectKey"
                rules={[
                  { required: true, message: "Please enter a project key" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="DT_XXXXXXXX"
                  suffix={
                    <Button
                      type="link"
                      size="small"
                      icon={<KeyOutlined />}
                      onClick={generateProjectKey}
                    >
                      Generate
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handleCreateProject}
                >
                  Create Project
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {currentStep === 1 && createdApp && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <CheckCircleOutlined
                style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
              />
              <Title level={3}>Project Created!</Title>
              <Text type="secondary">
                Your project "{createdApp.name}" is ready to go
              </Text>
            </div>

            <Card style={{ marginBottom: 24 }}>
              <Title level={5}>Your Project Key</Title>
              <Paragraph
                copyable
                code
                style={{ fontSize: 18, marginBottom: 0 }}
              >
                {createdApp.projectKey}
              </Paragraph>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Use this key to initialize DeltaTrack in your application
              </Text>
            </Card>

            <Card style={{ marginBottom: 24 }}>
              <Title level={5}>Quick Setup</Title>
              <Paragraph>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 12,
                    borderRadius: 8,
                    overflow: "auto",
                    fontSize: 13,
                  }}
                >
                  {`import DeltaTrack from 'deltatrack';

DeltaTrack.init({
  projectKey: '${createdApp.projectKey}',
  environment: 'production',
});`}
                </pre>
              </Paragraph>
            </Card>

            <Button type="primary" size="large" block onClick={handleFinish}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OnboardingModal;
