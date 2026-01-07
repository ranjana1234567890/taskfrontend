import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskModal from '../components/TaskModal';
import StatusBadge from '../components/StatusBadge';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrganizations: 0, totalUsers: 0, totalTasks: 0 });
  const [organizations, setOrganizations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ organization: '', status: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, orgsRes, tasksRes, usersRes] = await Promise.all([
        axios.get('/api/users/dashboard/stats'),
        axios.get('/api/organizations'),
        axios.get(`/api/tasks?organization=${filters.organization}&status=${filters.status}`),
        axios.get('/api/users')
      ]);

      setStats(statsRes.data);
      setOrganizations(orgsRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
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
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage all organizations, users, and tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Organizations"
            value={stats.totalOrganizations}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="purple"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="green"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <select
                value={filters.organization}
                onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Organizations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{org.name}</td>
                    <td className="py-3 px-4">{org.email}</td>
                    <td className="py-3 px-4">{org.phoneNumber || '-'}</td>
                    <td className="py-3 px-4">{new Date(org.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Organization</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{task.title}</td>
                      <td className="py-3 px-4">{task.organization?.name || '-'}</td>
                      <td className="py-3 px-4">{task.createdBy?.email || '-'}</td>
                      <td className="py-3 px-4">{task.assignedTo?.email || 'Unassigned'}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3 px-4">
                        {task.estimatedTime}h / {task.actualTime || 0}h
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                            className="text-xs px-2 py-1 border rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
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

        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          task={selectedTask}
          onSuccess={fetchData}
          members={users.filter(u => u.role === 'member')}
          organizations={organizations}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

