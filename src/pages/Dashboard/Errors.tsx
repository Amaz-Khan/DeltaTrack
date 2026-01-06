import { Typography } from "antd";

const { Title, Text } = Typography;

const Errors = () => {
  return (
    <div>
      <Title level={3}>Errors</Title>
      <Text type="secondary">Error tracking will be displayed here</Text>
    </div>
  );
};

export default Errors;
