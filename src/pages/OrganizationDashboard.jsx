import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TaskModal from "../components/TaskModal";
import StatusBadge from "../components/StatusBadge";

const OrganizationDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orgId = user?.organization?._id || user?.organization;

      if (!orgId) {
        toast.error("Organization not found");
        return;
      }

      const [statsRes, tasksRes, membersRes, orgRes] = await Promise.all([
        axios.get("/api/users/dashboard/stats"),
        axios.get("/api/tasks"),
        axios.get(`http://localhost:8080/api/organizations/${orgId}/members`),
        axios.get(`/api/organizations/${orgId}`),
      ]);

      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
      setOrganization(orgRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      toast.success("Task deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCreateMember = async (memberData) => {
    try {
      await axios.post("/api/users", memberData);
      toast.success("Member created successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create member");
    }
  };

  const handleBulkUpload = async (usersData) => {
    try {
      await axios.post("/api/users/bulk", { users: usersData });
      toast.success("Members uploaded successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload members");
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await axios.put(`/api/users/${userId}/password`, { newPassword });
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Organization Dashboard
          </h1>
          <p className="text-gray-600">
            {organization?.name || "Manage your organization"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            color="purple"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="green"
          />
          <StatCard
            title="Pending"
            value={stats.pendingTasks}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "tasks"
                    ? "border-b-2 border-primary-600 text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "members"
                    ? "border-b-2 border-primary-600 text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Members
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Created By
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Assigned To
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-500"
                      >
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{task.title}</td>
                        <td className="py-3 px-4">
                          {task.createdBy?.email || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {task.assignedTo?.email || "Unassigned"}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="py-3 px-4">
                          Est: {task.estimatedTime}h / Act:{" "}
                          {task.actualTime || 0}h
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="text-primary-600 hover:text-primary-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Members</h2>
              <button
                onClick={() => {
                  const username = prompt("Username:");
                  const email = prompt("Email:");
                  const password = prompt("Password:");
                  const phoneNumber = prompt("Phone Number (optional):");
                  if (username && email && password) {
                    handleCreateMember({
                      username,
                      email,
                      password,
                      phoneNumber,
                    });
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Member
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Username
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-gray-500"
                      >
                        No members found
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr
                        key={member._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{member.username || "-"}</td>
                        <td className="py-3 px-4">{member.email}</td>
                        <td className="py-3 px-4">
                          {member.phoneNumber || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              const newPassword = prompt("Enter new password:");
                              if (newPassword) {
                                handleResetPassword(member._id, newPassword);
                              }
                            }}
                            className="text-primary-600 hover:text-primary-800 text-sm"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          task={selectedTask}
          onSuccess={fetchData}
          members={members}
        />
      </div>
    </div>
  );
};

export default OrganizationDashboard;
