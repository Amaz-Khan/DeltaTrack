import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Button,
  Empty,
  Tag,
  Row,
  Col,
  Tooltip,
  Divider,
  Statistic,
} from "antd";
import {
  RobotOutlined,
  ReloadOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  AlertOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  BugOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import "./AISummary.css";

const { Title, Text, Paragraph } = Typography;

interface AISummaryProps {
  applicationId: number | string | undefined;
  timeRange?: string;
}

interface APIResponse {
  from: string;
  to: string;
  total: number;
  byType: Record<string, number>;
  sampleMessages: string[];
  aiSummary: string;
}

interface ParsedSummary {
  highlevelSummary: string;
  errorCategories: string[];
  trends: string[];
  suggestions: string[];
}

const AISummary = ({ applicationId, timeRange = "7d" }: AISummaryProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<APIResponse | null>(null);
  const [parsedSummary, setParsedSummary] = useState<ParsedSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const parseAISummary = (aiSummary: string): ParsedSummary => {
    const sections = aiSummary.split(/\n\n(?=[A-Z])/);

    let highlevelSummary = "";
    let errorCategories: string[] = [];
    let trends: string[] = [];
    let suggestions: string[] = [];

    sections.forEach((section) => {
      const lowerSection = section.toLowerCase();

      if (
        lowerSection.includes("high-level summary") ||
        lowerSection.startsWith("high-level")
      ) {
        highlevelSummary = section
          .replace(/^High-level summary\n?-?\s*/i, "")
          .trim();
      } else if (
        lowerSection.includes("key error categories") ||
        lowerSection.includes("root causes")
      ) {
        const lines = section
          .split("\n")
          .filter((line) => line.startsWith("-") || line.startsWith("•"));
        errorCategories = lines.map((line) =>
          line.replace(/^[-•]\s*/, "").trim(),
        );
      } else if (
        lowerSection.includes("trends") ||
        lowerSection.includes("spikes")
      ) {
        const lines = section
          .split("\n")
          .filter(
            (line) =>
              line.startsWith("-") ||
              line.startsWith("•") ||
              (line.trim() && !line.includes("Noticeable")),
          );
        trends = lines
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean);
      } else if (
        lowerSection.includes("suggestions") ||
        lowerSection.includes("concrete")
      ) {
        const lines = section
          .split("\n")
          .filter((line) => /^\d+\./.test(line.trim()));
        suggestions = lines.map((line) => line.replace(/^\d+\.\s*/, "").trim());
      }
    });

    // Fallback parsing if sections weren't found
    if (!highlevelSummary && aiSummary) {
      const firstParagraph = aiSummary.split("\n\n")[0];
      highlevelSummary = firstParagraph
        .replace(/^High-level summary\n?-?\s*/i, "")
        .trim();
    }

    if (suggestions.length === 0) {
      // Try to find numbered items anywhere
      const numberedItems = aiSummary.match(/\d+\.\s+[^\n]+/g);
      if (numberedItems) {
        suggestions = numberedItems.map((item) =>
          item.replace(/^\d+\.\s*/, "").trim(),
        );
      }
    }

    return { highlevelSummary, errorCategories, trends, suggestions };
  };

  const fetchSummary = async () => {
    if (!applicationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/ai/errors-summary`, {
        params: {
          applicationId,
          timeRange,
        },
      });

      console.log("AI Summary response:", response.data);

      if (response.data) {
        const apiData = response.data.data || response.data;
        setData(apiData);

        if (apiData.aiSummary) {
          const parsed = parseAISummary(apiData.aiSummary);
          setParsedSummary(parsed);
        }
      }
    } catch (e: any) {
      console.error("Failed to fetch AI summary:", e);
      setError(
        e.response?.data?.message ||
          e.message ||
          "Failed to generate AI summary",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchSummary();
    }
  }, [applicationId, timeRange]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return <BugOutlined style={{ color: "#ef4444" }} />;
      case "warning":
        return <WarningOutlined style={{ color: "#f59e0b" }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: "#6366f1" }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

  if (!applicationId) {
    return null;
  }

  return (
    <Card
      title={
        <div className="ai-card-title">
          <div className="ai-title-left">
            <div className="ai-icon-badge">
              <RobotOutlined />
              <span className="ai-sparkle">✨</span>
            </div>
            <span>AI Error Analysis</span>
          </div>
          <Tooltip title="Regenerate analysis">
            <Button
              type="text"
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchSummary}
              disabled={loading}
              size="small"
            />
          </Tooltip>
        </div>
      }
      className="ai-summary-card-v2"
      style={{ marginTop: 16 }}
    >
      {loading ? (
        <div className="ai-loading-v2">
          <Spin size="large" />
          <div className="ai-loading-text-v2">
            <Text strong>Analyzing your errors with AI...</Text>
            <Text type="secondary">This may take a few seconds</Text>
          </div>
        </div>
      ) : error ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="danger">{error}</Text>
              <br />
              <Button
                type="link"
                onClick={fetchSummary}
                style={{ marginTop: 8 }}
              >
                Try again
              </Button>
            </div>
          }
        />
      ) : data && parsedSummary ? (
        <div className="ai-content-v2">
          {/* Stats Row */}
          <Row gutter={[16, 16]} className="ai-stats-row">
            <Col xs={12} sm={6}>
              <div className="ai-stat-card">
                <Statistic
                  title="Total Events"
                  value={data.total}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: "#6366f1", fontSize: 24 }}
                />
              </div>
            </Col>
            {Object.entries(data.byType).map(([type, count]) => (
              <Col xs={12} sm={6} key={type}>
                <div className="ai-stat-card">
                  <Statistic
                    title={type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                    value={count}
                    prefix={getTypeIcon(type)}
                    valueStyle={{ color: getTypeColor(type), fontSize: 24 }}
                  />
                </div>
              </Col>
            ))}
            <Col xs={12} sm={6}>
              <div className="ai-stat-card">
                <div className="ai-time-range">
                  <ClockCircleOutlined
                    style={{ fontSize: 18, color: "#8b5cf6" }}
                  />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Analysis Period
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: 13 }}>
                      {new Date(data.from).toLocaleDateString()} -{" "}
                      {new Date(data.to).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* High-Level Summary */}
          <div className="ai-section summary-section-v2">
            <div className="ai-section-header">
              <AlertOutlined className="section-icon-v2" />
              <Text strong>Overview</Text>
            </div>
            <Paragraph className="ai-summary-text">
              {parsedSummary.highlevelSummary}
            </Paragraph>
          </div>

          {/* Sample Error Messages */}
          {data.sampleMessages && data.sampleMessages.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-header">
                <BugOutlined
                  className="section-icon-v2"
                  style={{ color: "#ef4444" }}
                />
                <Text strong>Sample Error Messages</Text>
              </div>
              <div className="error-messages-list">
                {data.sampleMessages.slice(0, 4).map((msg, index) => {
                  const isError = msg.toLowerCase().includes("[error]");
                  const isWarning = msg.toLowerCase().includes("[warning]");
                  return (
                    <div key={index} className="error-message-item">
                      <Tag
                        color={isError ? "red" : isWarning ? "orange" : "blue"}
                      >
                        {isError ? "ERROR" : isWarning ? "WARN" : "INFO"}
                      </Tag>
                      <Text
                        className="error-msg-text"
                        ellipsis={{ tooltip: msg }}
                      >
                        {msg.replace(/^\[(error|warning|info)\]\s*/i, "")}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Categories */}
          {parsedSummary.errorCategories.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-header">
                <BulbOutlined
                  className="section-icon-v2"
                  style={{ color: "#eab308" }}
                />
                <Text strong>Root Cause Analysis</Text>
              </div>
              <div className="categories-list">
                {parsedSummary.errorCategories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-bullet">{index + 1}</div>
                    <Text>{category}</Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {parsedSummary.suggestions.length > 0 && (
            <div className="ai-section recommendations-section-v2">
              <div className="ai-section-header">
                <RocketOutlined
                  className="section-icon-v2"
                  style={{ color: "#22c55e" }}
                />
                <Text strong>Recommended Actions</Text>
              </div>
              <div className="recommendations-list-v2">
                {parsedSummary.suggestions.map((suggestion, index) => (
                  <div key={index} className="recommendation-item-v2">
                    <div className="rec-badge">
                      <CheckCircleOutlined />
                    </div>
                    <Text>{suggestion}</Text>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No AI analysis available yet"
        />
      )}
    </Card>
  );
};

export default AISummary;
