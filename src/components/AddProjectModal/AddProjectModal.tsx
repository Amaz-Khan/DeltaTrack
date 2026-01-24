import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import { useAppStore } from "../../store/appStore";
import { useAuthStore } from "../../store/authStore";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const AddProjectModal = ({ open, onClose }: AddProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // User is determined from auth token on the backend
      const response = await apiClient.post("/applications", {
        name: values.name,
        projectKey: values.projectKey,
      });

      console.log("Create project response:", response.data);

      const newApp = response.data;
      // Use the ID from the API response (could be numeric or string)
      const appId = newApp.id ?? newApp._id ?? Date.now();

      addApplication({
        id: String(appId),
        name: newApp.name || values.name,
        projectKey:
          newApp.projectKey || newApp.project_key || values.projectKey,
      });

      message.success("Project created successfully!");
      form.resetFields();
      onClose();
    } catch (e: any) {
      console.error("Failed to create project:", e);
      const errorMessage =
        e.response?.data?.message || e.message || "Failed to create project";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Project"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Project
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: "Please enter a project name" }]}
        >
          <Input size="large" placeholder="My Awesome App" />
        </Form.Item>

        <Form.Item
          label="Project Key"
          name="projectKey"
          rules={[{ required: true, message: "Please enter a project key" }]}
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
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
