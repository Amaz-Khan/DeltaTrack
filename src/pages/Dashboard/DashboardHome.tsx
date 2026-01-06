import { Typography } from "antd";

const { Title, Text } = Typography;

const DashboardHome = () => {
  return (
    <div style={{ textAlign: "center", paddingTop: 100 }}>
      <Title level={2}>Welcome to DeltaTrack</Title>
      <Text type="secondary">
        Select an option from the sidebar to get started
      </Text>
    </div>
  );
};

export default DashboardHome;
