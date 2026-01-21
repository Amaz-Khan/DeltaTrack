import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Tag,
  Card,
  Input,
  Select,
  Space,
  Empty,
  Spin,
  Modal,
  Button,
  Row,
  Col,
  Statistic,
  Tooltip,
  Badge,
  Tabs,
  Timeline,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  BugOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  EnvironmentOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { useAppStore, ErrorEvent } from "../../store/appStore";
import apiClient from "../../services/apiClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./Dashboard.css";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

const Errors = () => {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterEnv, setFilterEnv] = useState<string | undefined>(undefined);
  const [selectedError, setSelectedError] = useState<ErrorEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedApp = useAppStore((state) => state.selectedApp);
  const errors = useAppStore((state) => state.errors);
  const setErrors = useAppStore((state) => state.setErrors);
  const isLoadingErrors = useAppStore((state) => state.isLoadingErrors);
  const setLoadingErrors = useAppStore((state) => state.setLoadingErrors);

  const fetchErrors = async () => {
    if (!selectedApp) {
      setErrors([]);
      return;
    }

    setLoadingErrors(true);
    try {
      const response = await apiClient.get(`/events/${selectedApp.id}`);
      const eventsData = response.data.events || response.data || [];
      const formattedErrors: ErrorEvent[] = eventsData.map((event: any) => ({
        id: event.id || event._id || String(Math.random()),
        type: event.type || "Error",
        message: event.message || "Unknown error",
        stack: event.stack,
        url: event.url,
        userAgent: event.userAgent,
        timestamp: event.timestamp || event.createdAt,
        environment: event.environment,
        applicationId: event.applicationId,
        count: event.count || 1,
        lastSeen: event.lastSeen || event.timestamp,
        firstSeen: event.firstSeen || event.timestamp,
      }));
      setErrors(formattedErrors);
    } catch (e) {
      console.error("Failed to fetch errors:", e);
      setErrors([]);
    } finally {
      setLoadingErrors(false);
    }
  };

  useEffect(() => {
    if (errors.length === 0 && selectedApp) {
      fetchErrors();
    }
  }, [selectedApp]);

  // Get unique error types for filter
  const errorTypes = Array.from(new Set(errors.map((e) => e.type)));
  const environments = Array.from(
    new Set(errors.map((e) => e.environment || "unknown")),
  );

  // Filter errors based on search, type, and environment
  const filteredErrors = errors.filter((error) => {
    const matchesSearch =
      !searchText ||
      error.message.toLowerCase().includes(searchText.toLowerCase()) ||
      error.type.toLowerCase().includes(searchText.toLowerCase()) ||
      error.url?.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = !filterType || error.type === filterType;
    const matchesEnv =
      !filterEnv || (error.environment || "unknown") === filterEnv;

    return matchesSearch && matchesType && matchesEnv;
  });

  // Stats calculations
  const totalErrors = filteredErrors.length;
  const prodErrors = filteredErrors.filter(
    (e) => e.environment === "production",
  ).length;
  const todayErrors = filteredErrors.filter((e) =>
    dayjs(e.timestamp).isAfter(dayjs().startOf("day")),
  ).length;

  // Get error frequency for mini chart
  const getErrorFrequency = () => {
    const hours: { [key: string]: number } = {};
    for (let i = 23; i >= 0; i--) {
      const hour = dayjs().subtract(i, "hours").format("HH:00");
      hours[hour] = 0;
    }
    filteredErrors.forEach((error) => {
      if (dayjs(error.timestamp).isAfter(dayjs().subtract(24, "hours"))) {
        const hour = dayjs(error.timestamp).format("HH:00");
        if (hours[hour] !== undefined) {
          hours[hour]++;
        }
      }
    });
    return Object.entries(hours).map(([hour, count]) => ({ hour, count }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showErrorDetails = (error: ErrorEvent) => {
    setSelectedError(error);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Status",
      key: "status",
      width: 60,
      render: () => <Badge status="error" />,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag
          color={
            type === "Error" || type === "error"
              ? "red"
              : type === "Warning" || type === "warning"
                ? "orange"
                : type === "unhandledrejection"
                  ? "purple"
                  : "blue"
          }
          style={{ fontWeight: 500 }}
        >
          {type}
        </Tag>
      ),
      filters: errorTypes.map((type) => ({ text: type, value: type })),
      onFilter: (value: any, record: ErrorEvent) => record.type === value,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (message: string, record: ErrorEvent) => (
        <Tooltip title="Click to view details">
          <a
            onClick={() => showErrorDetails(record)}
            style={{
              cursor: "pointer",
              color: "#1f2937",
              fontWeight: 500,
            }}
          >
            <ExclamationCircleOutlined
              style={{ marginRight: 6, color: "#ef4444" }}
            />
            {message}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Environment",
      dataIndex: "environment",
      key: "environment",
      width: 120,
      render: (env: string) => (
        <Tag
          color={
            env === "production"
              ? "red"
              : env === "staging"
                ? "orange"
                : "green"
          }
          icon={<EnvironmentOutlined />}
        >
          {env || "unknown"}
        </Tag>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      ellipsis: true,
      width: 200,
      render: (url: string) =>
        url ? (
          <Tooltip title={url}>
            <span style={{ color: "#6b7280" }}>
              <GlobalOutlined style={{ marginRight: 4 }} />
              {url.length > 30 ? `${url.substring(0, 30)}...` : url}
            </span>
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      width: 90,
      sorter: (a: ErrorEvent, b: ErrorEvent) => (a.count || 0) - (b.count || 0),
      render: (count: number) => (
        <Badge
          count={count || 1}
          style={{
            backgroundColor:
              count > 10 ? "#ef4444" : count > 5 ? "#f59e0b" : "#6b7280",
          }}
        />
      ),
    },
    {
      title: "Last Seen",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 140,
      sorter: (a: ErrorEvent, b: ErrorEvent) =>
        dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      defaultSortOrder: "descend" as const,
      render: (timestamp: string) => (
        <Tooltip title={dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")}>
          <span style={{ color: "#6b7280" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {dayjs(timestamp).fromNow()}
          </span>
        </Tooltip>
      ),
    },
  ];

  if (!selectedApp) {
    return (
      <div>
        <Title level={3}>Errors</Title>
        <Empty
          description="Select a project to view errors"
          style={{ marginTop: 60 }}
        />
      </div>
    );
  }

  const miniChartConfig = {
    data: getErrorFrequency(),
    xField: "hour",
    yField: "count",
    color: "#6366f1",
    columnStyle: { radius: [4, 4, 0, 0] },
    height: 60,
    xAxis: false as const,
    yAxis: false as const,
    tooltip: false as const,
    animation: false as const,
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            🐛 Error Tracking
          </Title>
          <Text type="secondary">
            Monitor and debug errors across your application
          </Text>
        </div>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchErrors}
          loading={isLoadingErrors}
          style={{ background: "#6366f1" }}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderLeft: "4px solid #6366f1" }}>
            <Statistic
              title="Total Errors"
              value={totalErrors}
              prefix={<BugOutlined style={{ color: "#6366f1" }} />}
              valueStyle={{ color: "#6366f1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderLeft: "4px solid #ef4444" }}>
            <Statistic
              title="Production Errors"
              value={prodErrors}
              prefix={
                <ExclamationCircleOutlined style={{ color: "#ef4444" }} />
              }
              valueStyle={{ color: "#ef4444" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderLeft: "4px solid #10b981" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Statistic
                title="Today's Errors"
                value={todayErrors}
                prefix={<ClockCircleOutlined style={{ color: "#10b981" }} />}
                valueStyle={{ color: "#10b981" }}
              />
              <div style={{ width: 100 }}>
                <Column {...miniChartConfig} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters & Table */}
      <Card>
        <Space
          style={{ marginBottom: 16, width: "100%", flexWrap: "wrap" }}
          size="middle"
        >
          <Input
            placeholder="Search errors..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            placeholder="All types"
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
            allowClear
            options={errorTypes.map((type) => ({ value: type, label: type }))}
          />
          <Select
            placeholder="All environments"
            value={filterEnv}
            onChange={setFilterEnv}
            style={{ width: 150 }}
            allowClear
            options={environments.map((env) => ({ value: env, label: env }))}
          />
          {(searchText || filterType || filterEnv) && (
            <Button
              type="link"
              onClick={() => {
                setSearchText("");
                setFilterType(undefined);
                setFilterEnv(undefined);
              }}
            >
              Clear filters
            </Button>
          )}
        </Space>

        {isLoadingErrors ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : filteredErrors.length > 0 ? (
          <Table
            dataSource={filteredErrors}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} errors`,
            }}
            rowClassName={() => "error-row"}
          />
        ) : (
          <Empty
            description={
              searchText || filterType || filterEnv
                ? "No errors match your filters"
                : "No errors yet. Integrate the SDK to start tracking errors."
            }
            style={{ padding: 60 }}
          />
        )}
      </Card>

      {/* Error Details Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BugOutlined style={{ color: "#ef4444", fontSize: 20 }} />
            <span>Error Details</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
        styles={{ body: { maxHeight: "70vh", overflow: "auto" } }}
      >
        {selectedError && (
          <Tabs
            defaultActiveKey="overview"
            items={[
              {
                key: "overview",
                label: "Overview",
                children: (
                  <div style={{ padding: "16px 0" }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Card size="small" style={{ background: "#fef2f2" }}>
                          <Text type="secondary">Type</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag
                              color={
                                selectedError.type === "Error" ||
                                selectedError.type === "error"
                                  ? "red"
                                  : selectedError.type === "Warning" ||
                                      selectedError.type === "warning"
                                    ? "orange"
                                    : "blue"
                              }
                              style={{ fontSize: 14, padding: "4px 12px" }}
                            >
                              {selectedError.type}
                            </Tag>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Card size="small" style={{ background: "#f0fdf4" }}>
                          <Text type="secondary">Environment</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag
                              color={
                                selectedError.environment === "production"
                                  ? "red"
                                  : selectedError.environment === "staging"
                                    ? "orange"
                                    : "green"
                              }
                              icon={<EnvironmentOutlined />}
                              style={{ fontSize: 14, padding: "4px 12px" }}
                            >
                              {selectedError.environment || "unknown"}
                            </Tag>
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    <Card size="small" style={{ marginTop: 16 }}>
                      <Text type="secondary">Error Message</Text>
                      <Paragraph
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#1f2937",
                        }}
                      >
                        {selectedError.message}
                      </Paragraph>
                    </Card>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                      <Col xs={24} sm={12}>
                        <Card size="small">
                          <Text type="secondary">
                            <GlobalOutlined style={{ marginRight: 6 }} />
                            URL
                          </Text>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ marginTop: 8, marginBottom: 0 }}
                          >
                            {selectedError.url || "-"}
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Card size="small">
                          <Text type="secondary">
                            <ClockCircleOutlined style={{ marginRight: 6 }} />
                            Timestamp
                          </Text>
                          <div style={{ marginTop: 8 }}>
                            <Text strong>
                              {dayjs(selectedError.timestamp).format(
                                "YYYY-MM-DD HH:mm:ss",
                              )}
                            </Text>
                            <br />
                            <Text type="secondary">
                              ({dayjs(selectedError.timestamp).fromNow()})
                            </Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    {selectedError.userAgent && (
                      <Card size="small" style={{ marginTop: 16 }}>
                        <Text type="secondary">User Agent</Text>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{
                            marginTop: 8,
                            marginBottom: 0,
                            fontSize: 12,
                          }}
                        >
                          {selectedError.userAgent}
                        </Paragraph>
                      </Card>
                    )}
                  </div>
                ),
              },
              {
                key: "stacktrace",
                label: "Stack Trace",
                children: selectedError.stack ? (
                  <div style={{ position: "relative" }}>
                    <Button
                      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                      size="small"
                      onClick={() => copyToClipboard(selectedError.stack || "")}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                      }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <pre
                      style={{
                        background: "#1f2937",
                        color: "#f3f4f6",
                        padding: 16,
                        borderRadius: 8,
                        overflow: "auto",
                        fontSize: 12,
                        lineHeight: 1.6,
                        maxHeight: 400,
                      }}
                    >
                      <code>{selectedError.stack}</code>
                    </pre>
                  </div>
                ) : (
                  <Empty description="No stack trace available" />
                ),
              },
              {
                key: "timeline",
                label: "Timeline",
                children: (
                  <Timeline
                    style={{ padding: "16px 0" }}
                    items={[
                      {
                        color: "green",
                        children: (
                          <>
                            <Text strong>First seen</Text>
                            <br />
                            <Text type="secondary">
                              {dayjs(
                                selectedError.firstSeen ||
                                  selectedError.timestamp,
                              ).format("YYYY-MM-DD HH:mm:ss")}
                            </Text>
                          </>
                        ),
                      },
                      {
                        color: "red",
                        children: (
                          <>
                            <Text strong>Last seen</Text>
                            <br />
                            <Text type="secondary">
                              {dayjs(
                                selectedError.lastSeen ||
                                  selectedError.timestamp,
                              ).format("YYYY-MM-DD HH:mm:ss")}
                            </Text>
                          </>
                        ),
                      },
                      {
                        color: "blue",
                        children: (
                          <>
                            <Text strong>Total occurrences</Text>
                            <br />
                            <Badge
                              count={selectedError.count || 1}
                              style={{ backgroundColor: "#6366f1" }}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default Errors;
