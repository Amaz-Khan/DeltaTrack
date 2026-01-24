import {
  Typography,
  Card,
  Tabs,
  Empty,
  Alert,
  Select,
  Space,
  Row,
  Col,
} from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { useAppStore } from "../../store/appStore";

const { Title, Text, Paragraph } = Typography;

const Setup = () => {
  const selectedApp = useAppStore((state) => state.selectedApp);
  const applications = useAppStore((state) => state.applications);
  const selectApp = useAppStore((state) => state.selectApp);

  const handleAppChange = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (app) {
      selectApp(app);
    }
  };

  if (!selectedApp && applications.length === 0) {
    return (
      <div>
        <Title level={3}>Setup Instructions</Title>
        <Empty
          description="No projects found. Create a project first to view setup instructions."
          style={{ marginTop: 60 }}
        />
      </div>
    );
  }

  if (!selectedApp) {
    return (
      <div>
        <Title level={3}>Setup Instructions</Title>
        <Card style={{ marginTop: 16 }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text>Select a project to view setup instructions:</Text>
            <Select
              placeholder="Select Project"
              onChange={handleAppChange}
              style={{ width: 300 }}
              options={applications.map((app) => ({
                value: app.id,
                label: app.name,
              }))}
            />
          </Space>
        </Card>
      </div>
    );
  }

  const npmInstall = `npm install deltatrack`;
  const scriptTag = `<script src="https://cdn.deltatrack.io/v1/tracker.js" data-api-key="${selectedApp.projectKey}"></script>`;
  const initCode = `import DeltaTrack from 'deltatrack';

DeltaTrack.init({
  apiKey: '${selectedApp.projectKey}',
  environment: 'production', // or 'development', 'staging'
});`;

  const reactExample = `// App.tsx or index.tsx
import DeltaTrack from 'deltatrack';

// Initialize at the top of your app
DeltaTrack.init({
  apiKey: '${selectedApp.projectKey}',
  environment: process.env.NODE_ENV,
});

// Errors will be automatically captured, or you can manually track:
try {
  // your code
} catch (error) {
  DeltaTrack.captureError(error);
}`;

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Setup Instructions
          </Title>
          <Text type="secondary">
            Follow the steps below to integrate DeltaTrack into your application
          </Text>
        </Col>
        <Col>
          <Space>
            <AppstoreOutlined style={{ color: "#6366f1" }} />
            <Select
              value={selectedApp.id}
              onChange={handleAppChange}
              style={{ width: 220 }}
              options={applications.map((app) => ({
                value: app.id,
                label: app.name,
              }))}
            />
          </Space>
        </Col>
      </Row>

      <Alert
        message={`Project: ${selectedApp.name}`}
        description={
          <span>
            API Key:{" "}
            <Text code copyable>
              {selectedApp.projectKey}
            </Text>
          </span>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Tabs
        defaultActiveKey="npm"
        style={{ marginTop: 24 }}
        items={[
          {
            key: "npm",
            label: "NPM",
            children: (
              <Card>
                <Title level={5}>1. Install the package</Title>
                <Paragraph code copyable>
                  {npmInstall}
                </Paragraph>
                <Title level={5}>2. Initialize in your app</Title>
                <Paragraph>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: 16,
                      borderRadius: 8,
                      overflow: "auto",
                    }}
                  >
                    {initCode}
                  </pre>
                </Paragraph>
              </Card>
            ),
          },
          {
            key: "react",
            label: "React Example",
            children: (
              <Card>
                <Title level={5}>Full React Integration</Title>
                <Paragraph>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: 16,
                      borderRadius: 8,
                      overflow: "auto",
                    }}
                  >
                    {reactExample}
                  </pre>
                </Paragraph>
              </Card>
            ),
          },
          {
            key: "script",
            label: "Script Tag",
            children: (
              <Card>
                <Title level={5}>Add this script to your HTML</Title>
                <Paragraph code copyable>
                  {scriptTag}
                </Paragraph>
                <Text type="secondary">
                  Add this script tag to the <Text code>&lt;head&gt;</Text>{" "}
                  section of your HTML file.
                </Text>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Setup;
