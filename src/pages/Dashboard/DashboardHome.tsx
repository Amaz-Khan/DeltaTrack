import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Empty,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Table,
  Tag,
  Segmented,
  Tooltip,
  Progress,
  Badge,
} from "antd";
import {
  BugOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Line, Pie, Column, Area, Heatmap } from "@ant-design/charts";
import OnboardingModal from "../../components/OnboardingModal/OnboardingModal";
import { useAppStore, ErrorEvent } from "../../store/appStore";
import apiClient from "../../services/apiClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isBetween from "dayjs/plugin/isBetween";
import "./Dashboard.css";

dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);

const { Title, Text } = Typography;

const DashboardHome = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [timeRange, setTimeRange] = useState<string | number>("7d");
  const applications = useAppStore((state) => state.applications);
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );
  const selectedApp = useAppStore((state) => state.selectedApp);
  const errors = useAppStore((state) => state.errors);
  const setErrors = useAppStore((state) => state.setErrors);
  const isLoadingErrors = useAppStore((state) => state.isLoadingErrors);
  const setLoadingErrors = useAppStore((state) => state.setLoadingErrors);

  useEffect(() => {
    if (!hasCompletedOnboarding && applications.length === 0) {
      setShowOnboarding(true);
    }
  }, [hasCompletedOnboarding, applications]);

  useEffect(() => {
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
          type: event.type || "error",
          message: event.message || "Unknown error",
          stack: event.stack,
          url: event.source || event.url,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: event.timestamp || event.createdAt,
          environment: event.environment,
          applicationId: event.applicationId,
        }));
        setErrors(formattedErrors);
      } catch (e) {
        console.error("Failed to fetch errors:", e);
        setErrors([]);
      } finally {
        setLoadingErrors(false);
      }
    };

    fetchErrors();
  }, [selectedApp]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!selectedApp && applications.length === 0) {
    return (
      <>
        <OnboardingModal
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
        <div style={{ textAlign: "center", paddingTop: 100 }}>
          <Empty
            description={
              <span>
                No projects yet.{" "}
                <a onClick={() => setShowOnboarding(true)}>
                  Create your first project
                </a>
              </span>
            }
          />
        </div>
      </>
    );
  }

  const totalErrors = errors.length;
  const last24Hours = errors.filter((e) =>
    dayjs(e.timestamp).isAfter(dayjs().subtract(24, "hours")),
  ).length;
  const last7Days = errors.filter((e) =>
    dayjs(e.timestamp).isAfter(dayjs().subtract(7, "days")),
  ).length;
  const uniqueTypes = new Set(errors.map((e) => e.type)).size;
  const recentErrors = errors.slice(0, 5);

  // Calculate trend (comparison with previous period)
  const previousPeriodErrors = errors.filter((e) =>
    dayjs(e.timestamp).isBetween(
      dayjs().subtract(14, "days"),
      dayjs().subtract(7, "days"),
    ),
  ).length;
  const trendPercentage =
    previousPeriodErrors > 0
      ? Math.round(
          ((last7Days - previousPeriodErrors) / previousPeriodErrors) * 100,
        )
      : 0;

  // Most common error
  const errorCounts = useMemo(() => {
    const counts: Record<string, { count: number; message: string }> = {};
    errors.forEach((e) => {
      const key = e.message.substring(0, 50);
      if (!counts[key]) {
        counts[key] = { count: 0, message: e.message };
      }
      counts[key].count++;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [errors]);

  const mostCommonError = errorCounts[0];

  // Get errors by time range
  const getTimeRangeData = () => {
    if (timeRange === "24h") {
      return { days: 1, format: "HH:00", unit: "hours" as const, count: 24 };
    } else if (timeRange === "7d") {
      return { days: 7, format: "MMM DD", unit: "days" as const, count: 7 };
    } else {
      return { days: 30, format: "MMM DD", unit: "days" as const, count: 30 };
    }
  };

  const getErrorsByDay = () => {
    const { days, format, unit, count } = getTimeRangeData();
    const data: { [key: string]: number } = {};
    for (let i = count - 1; i >= 0; i--) {
      const key = dayjs().subtract(i, unit).format(format);
      data[key] = 0;
    }
    errors.forEach((error) => {
      if (dayjs(error.timestamp).isAfter(dayjs().subtract(days, "days"))) {
        const key = dayjs(error.timestamp).format(format);
        if (data[key] !== undefined) {
          data[key]++;
        }
      }
    });
    return Object.entries(data).map(([date, count]) => ({ date, count }));
  };

  const getErrorsByType = () => {
    const types: { [key: string]: number } = {};
    errors.forEach((error) => {
      const type = error.type || "Unknown";
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getErrorsByHour = () => {
    const hours: { [key: string]: number } = {};
    for (let i = 23; i >= 0; i--) {
      const hour = dayjs().subtract(i, "hours").format("HH:00");
      hours[hour] = 0;
    }
    errors.forEach((error) => {
      if (dayjs(error.timestamp).isAfter(dayjs().subtract(24, "hours"))) {
        const hour = dayjs(error.timestamp).format("HH:00");
        if (hours[hour] !== undefined) {
          hours[hour]++;
        }
      }
    });
    return Object.entries(hours).map(([hour, count]) => ({ hour, count }));
  };

  // Get heatmap data for errors by day of week and hour
  const getHeatmapData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data: { day: string; hour: string; count: number }[] = [];

    // Initialize all combinations
    days.forEach((day) => {
      for (let h = 0; h < 24; h++) {
        data.push({ day, hour: `${h}:00`, count: 0 });
      }
    });

    errors.forEach((error) => {
      const d = dayjs(error.timestamp);
      const day = days[d.day()];
      const hour = `${d.hour()}:00`;
      const item = data.find((i) => i.day === day && i.hour === hour);
      if (item) {
        item.count++;
      }
    });

    return data;
  };

  // Get environment distribution
  const getErrorsByEnvironment = () => {
    const envs: { [key: string]: number } = {};
    errors.forEach((error) => {
      const env = error.environment || "unknown";
      envs[env] = (envs[env] || 0) + 1;
    });
    return Object.entries(envs).map(([environment, count]) => ({
      environment,
      count,
      percentage: Math.round((count / totalErrors) * 100),
    }));
  };

  // Color themes
  const chartColors = {
    primary: "#6366f1",
    error: "#ef4444",
    warning: "#f59e0b",
    success: "#10b981",
    info: "#3b82f6",
    gradient: ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"],
  };

  const areaConfig = {
    data: getErrorsByDay(),
    xField: "date",
    yField: "count",
    smooth: true,
    line: {
      style: {
        stroke: chartColors.error,
        lineWidth: 3,
      },
    },
    areaStyle: () => ({
      fill: `l(270) 0:#ffffff 0.5:${chartColors.error}30 1:${chartColors.error}`,
    }),
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: chartColors.error,
        stroke: "#fff",
        lineWidth: 2,
      },
    },
    height: 280,
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1500,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: "Errors",
        value: datum.count,
      }),
    },
  };

  const pieConfig = {
    data: getErrorsByType(),
    angleField: "count",
    colorField: "type",
    radius: 0.85,
    innerRadius: 0.65,
    color: chartColors.gradient,
    label: {
      type: "spider",
      content: "{name}\n{percentage}",
      style: {
        fontSize: 12,
      },
    },
    legend: {
      position: "bottom" as const,
      itemName: {
        style: {
          fontSize: 12,
        },
      },
    },
    statistic: {
      title: {
        content: "Total",
        style: {
          fontSize: 14,
        },
      },
      content: {
        style: {
          fontSize: 24,
          fontWeight: "bold",
        },
      },
    },
    height: 280,
    animation: {
      appear: {
        animation: "fade-in",
        duration: 1000,
      },
    },
  };

  const columnConfig = {
    data: getErrorsByHour(),
    xField: "hour",
    yField: "count",
    color: ({ hour }: { hour: string }) => {
      const h = parseInt(hour);
      if (h >= 9 && h <= 17) return chartColors.primary;
      if (h >= 18 || h <= 5) return chartColors.info;
      return chartColors.warning;
    },
    columnStyle: {
      radius: [6, 6, 0, 0],
    },
    height: 220,
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
        style: {
          fontSize: 10,
        },
      },
    },
    animation: {
      appear: {
        animation: "grow-in-y",
        duration: 1000,
      },
    },
  };

  const heatmapConfig = {
    data: getHeatmapData(),
    xField: "hour",
    yField: "day",
    colorField: "count",
    color: ["#f0f0f0", "#bae7ff", "#69b1ff", "#1677ff", "#0958d9"],
    shape: "square",
    height: 200,
    meta: {
      hour: {
        type: "cat",
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        style: {
          fontSize: 10,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 11,
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: `${datum.day} ${datum.hour}`,
        value: `${datum.count} errors`,
      }),
    },
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={
            type === "error" ? "red" : type === "warning" ? "orange" : "blue"
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Source",
      dataIndex: "url",
      key: "url",
      ellipsis: true,
      render: (url: string) => url || "-",
    },
    {
      title: "Line",
      dataIndex: "lineno",
      key: "lineno",
      render: (lineno: number, record: ErrorEvent) =>
        lineno ? `${lineno}:${record.colno || 0}` : "-",
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => dayjs(timestamp).fromNow(),
    },
  ];

  return (
    <>
      <OnboardingModal
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      <div>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            {selectedApp ? selectedApp.name : "Dashboard"}
          </Title>
          <Text type="secondary">
            {selectedApp
              ? `Project Key: ${selectedApp.projectKey}`
              : "Select a project from the dropdown above"}
          </Text>
        </div>

        {isLoadingErrors ? (
          <div style={{ textAlign: "center", paddingTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Stats Cards Row */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  style={{
                    background:
                      "linear-gradient(135deg, #fff5f5 0%, #fff 100%)",
                    borderLeft: "4px solid #ef4444",
                  }}
                >
                  <Statistic
                    title={<span style={{ color: "#666" }}>Total Errors</span>}
                    value={totalErrors}
                    prefix={<BugOutlined style={{ color: "#ef4444" }} />}
                    valueStyle={{ color: "#ef4444", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  style={{
                    background:
                      "linear-gradient(135deg, #fff7ed 0%, #fff 100%)",
                    borderLeft: "4px solid #f59e0b",
                  }}
                >
                  <Statistic
                    title={<span style={{ color: "#666" }}>Last 24 Hours</span>}
                    value={last24Hours}
                    prefix={
                      <ClockCircleOutlined style={{ color: "#f59e0b" }} />
                    }
                    valueStyle={{ color: "#f59e0b", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  style={{
                    background:
                      "linear-gradient(135deg, #eff6ff 0%, #fff 100%)",
                    borderLeft: "4px solid #3b82f6",
                  }}
                >
                  <Statistic
                    title={<span style={{ color: "#666" }}>Last 7 Days</span>}
                    value={last7Days}
                    prefix={<WarningOutlined style={{ color: "#3b82f6" }} />}
                    valueStyle={{ color: "#3b82f6", fontWeight: 700 }}
                    suffix={
                      trendPercentage !== 0 && (
                        <Tooltip
                          title={`${Math.abs(trendPercentage)}% ${trendPercentage > 0 ? "increase" : "decrease"} from last week`}
                        >
                          <span style={{ fontSize: 14, marginLeft: 8 }}>
                            {trendPercentage > 0 ? (
                              <RiseOutlined style={{ color: "#ef4444" }} />
                            ) : (
                              <FallOutlined style={{ color: "#10b981" }} />
                            )}
                            <span
                              style={{
                                color:
                                  trendPercentage > 0 ? "#ef4444" : "#10b981",
                              }}
                            >
                              {Math.abs(trendPercentage)}%
                            </span>
                          </span>
                        </Tooltip>
                      )
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  style={{
                    background:
                      "linear-gradient(135deg, #f0fdf4 0%, #fff 100%)",
                    borderLeft: "4px solid #10b981",
                  }}
                >
                  <Statistic
                    title={<span style={{ color: "#666" }}>Error Types</span>}
                    value={uniqueTypes}
                    prefix={
                      <ThunderboltOutlined style={{ color: "#10b981" }} />
                    }
                    valueStyle={{ color: "#10b981", fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>

            {errors.length > 0 ? (
              <>
                {/* Most Common Error Alert */}
                {mostCommonError && mostCommonError.count > 1 && (
                  <Card
                    style={{
                      marginTop: 16,
                      background:
                        "linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)",
                      border: "1px solid #fcd34d",
                    }}
                  >
                    <Row align="middle" gutter={16}>
                      <Col>
                        <FireOutlined
                          style={{ fontSize: 28, color: "#f59e0b" }}
                        />
                      </Col>
                      <Col flex="auto">
                        <Text strong style={{ color: "#92400e" }}>
                          Most Frequent Error
                        </Text>
                        <br />
                        <Text style={{ color: "#78350f" }}>
                          "{mostCommonError.message.substring(0, 80)}
                          {mostCommonError.message.length > 80 ? "..." : ""}"
                        </Text>
                      </Col>
                      <Col>
                        <Badge
                          count={`${mostCommonError.count}x`}
                          style={{
                            backgroundColor: "#f59e0b",
                            fontSize: 14,
                            padding: "0 12px",
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}

                {/* Time Range Selector and Main Chart */}
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600 }}>
                        📈 Error Trends
                      </span>
                      <Segmented
                        size="small"
                        options={[
                          { label: "24h", value: "24h" },
                          { label: "7 days", value: "7d" },
                          { label: "30 days", value: "30d" },
                        ]}
                        value={timeRange}
                        onChange={setTimeRange}
                      />
                    </div>
                  }
                  style={{ marginTop: 16 }}
                >
                  <Area {...areaConfig} />
                </Card>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24} lg={12}>
                    <Card title="🔥 Errors by Type">
                      <Pie {...pieConfig} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="📊 Error Distribution by Environment">
                      <div style={{ padding: "16px 0" }}>
                        {getErrorsByEnvironment().map((env) => (
                          <div
                            key={env.environment}
                            style={{ marginBottom: 16 }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 4,
                              }}
                            >
                              <Tag
                                color={
                                  env.environment === "production"
                                    ? "red"
                                    : env.environment === "staging"
                                      ? "orange"
                                      : "green"
                                }
                              >
                                {env.environment}
                              </Tag>
                              <Text type="secondary">
                                {env.count} errors ({env.percentage}%)
                              </Text>
                            </div>
                            <Progress
                              percent={env.percentage}
                              showInfo={false}
                              strokeColor={
                                env.environment === "production"
                                  ? "#ef4444"
                                  : env.environment === "staging"
                                    ? "#f59e0b"
                                    : "#10b981"
                              }
                              trailColor="#f0f0f0"
                            />
                          </div>
                        ))}
                        {getErrorsByEnvironment().length === 0 && (
                          <Empty description="No environment data" />
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24} lg={14}>
                    <Card title="⏰ Errors by Hour (Last 24 Hours)">
                      <Column {...columnConfig} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={10}>
                    <Card title="📅 Activity Heatmap (Day × Hour)">
                      <Heatmap {...heatmapConfig} />
                    </Card>
                  </Col>
                </Row>

                <Card
                  title="🐛 Recent Errors"
                  style={{ marginTop: 16 }}
                  extra={
                    <a href="#/dashboard/errors" style={{ color: "#6366f1" }}>
                      View all →
                    </a>
                  }
                >
                  <Table
                    dataSource={recentErrors}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </>
            ) : (
              <Card style={{ marginTop: 24 }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      No errors recorded yet.
                      <br />
                      Integrate the SDK to start tracking errors.
                    </span>
                  }
                />
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DashboardHome;
