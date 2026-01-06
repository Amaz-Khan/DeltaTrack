import { Typography, Card, Tabs } from "antd";

const { Title, Text, Paragraph } = Typography;

const Setup = () => {
  const npmInstall = `npm install deltatrack`;
  const scriptTag = `<script src="https://cdn.deltatrack.io/v1/tracker.js"></script>`;
  const initCode = `import DeltaTrack from 'deltatrack';

DeltaTrack.init({
  apiKey: 'YOUR_API_KEY',
  environment: 'production',
});`;

  return (
    <div>
      <Title level={3}>Setup Instructions</Title>
      <Text type="secondary">
        Follow the steps below to integrate DeltaTrack into your application
      </Text>

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
            key: "script",
            label: "Script Tag",
            children: (
              <Card>
                <Title level={5}>Add this script to your HTML</Title>
                <Paragraph code copyable>
                  {scriptTag}
                </Paragraph>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Setup;
