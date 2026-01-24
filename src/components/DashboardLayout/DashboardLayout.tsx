import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, theme, Select, Space } from "antd";
import {
  DashboardOutlined,
  BugOutlined,
  SettingOutlined,
  CodeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";
import { useAppStore, Application } from "../../store/appStore";
import AddProjectModal from "../AddProjectModal/AddProjectModal";
import apiClient from "../../services/apiClient";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const applications = useAppStore((state) => state.applications);
  const selectedApp = useAppStore((state) => state.selectedApp);
  const selectApp = useAppStore((state) => state.selectApp);
  const setApplications = useAppStore((state) => state.setApplications);
  const resetAppState = useAppStore((state) => state.resetAppState);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get("/applications");
        console.log("Raw API response:", response.data);

        // Handle both array response and object with applications array
        const appsData = Array.isArray(response.data)
          ? response.data
          : response.data.applications || response.data.data || [];

        const apps = appsData.map((app: any) => {
          console.log("Processing app:", app);
          return {
            id: String(app.id || app._id),
            name: app.name || app.project_name || "Unnamed Project",
            projectKey: app.project_key || app.projectKey || "",
            createdAt: app.created_at || app.createdAt,
            userId: app.userId || app.user_id,
          };
        });

        console.log("Mapped apps:", apps);

        // Always update with fresh data from API
        setApplications(apps);

        // If API returns empty, clear selected app too
        if (apps.length === 0) {
          selectApp(null);
        } else if (
          !selectedApp ||
          !apps.find((a: Application) => a.id === selectedApp.id)
        ) {
          // Select first app if no app selected or selected app no longer exists
          selectApp(apps[0]);
        }
      } catch (e) {
        console.error("Failed to fetch applications:", e);
      }
    };

    fetchApplications();
  }, []);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/errors",
      icon: <BugOutlined />,
      label: "Errors",
    },
    {
      key: "/dashboard/setup",
      icon: <CodeOutlined />,
      label: "Setup",
    },
    {
      key: "/dashboard/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    logout();
    resetAppState();
    navigate("/login");
  };

  const handleAppChange = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    selectApp(app || null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span
            style={{
              fontSize: collapsed ? 16 : 20,
              fontWeight: 700,
              color: "#06266b",
            }}
          >
            {collapsed ? "DT" : "DeltaTrack"}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            padding: "0 16px",
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            danger
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Space>
            <AppstoreOutlined />
            <Select
              placeholder="Select Project"
              value={selectedApp?.id}
              onChange={handleAppChange}
              style={{ width: 200 }}
              options={applications.map((app) => ({
                value: app.id,
                label: app.name,
              }))}
              notFoundContent="No projects"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddProject(true)}
            >
              New Project
            </Button>
          </Space>
          <div style={{ width: 32 }} />
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <AddProjectModal
        open={showAddProject}
        onClose={() => setShowAddProject(false)}
      />
    </Layout>
  );
};

export default DashboardLayout;
