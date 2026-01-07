import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskModal from '../components/TaskModal';
import StatusBadge from '../components/StatusBadge';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ myTasks: 0, assignedTasks: 0, orgTasks: 0, completedTasks: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, my, assigned, org

  useEffect(() => {
    fetchData();
  }, [filter, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        axios.get('/api/users/dashboard/stats'),
        axios.get('/api/tasks')
      ]);

      setStats(statsRes.data);
      
      // Filter tasks based on selected filter
      let filteredTasks = tasksRes.data;
      const userId = user?._id;
      
      if (filter === 'my') {
        filteredTasks = tasksRes.data.filter(t => t.createdBy?._id === userId || t.createdBy === userId);
      } else if (filter === 'assigned') {
        filteredTasks = tasksRes.data.filter(t => t.assignedTo?._id === userId || t.assignedTo === userId);
      }
      // 'org' and 'all' show all organization tasks
      
      setTasks(filteredTasks);
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

  const handleUpdateStatus = async (taskId, newStatus, actualTime) => {
    try {
      const updateData = { status: newStatus };
      if (actualTime !== undefined) {
        updateData.actualTime = actualTime;
      }
      await axios.put(`/api/tasks/${taskId}`, updateData);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Manage your tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Tasks"
            value={stats.myTasks}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Assigned To Me"
            value={stats.assignedTasks}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            color="purple"
          />
          <StatCard
            title="Organization Tasks"
            value={stats.orgTasks}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="green"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="orange"
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter('my')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'my'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Tasks
              </button>
              <button
                onClick={() => setFilter('assigned')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'assigned'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Assigned To Me
              </button>
              <button
                onClick={() => setFilter('org')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'org'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Organization
              </button>
            </div>
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
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
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => {
                    const userId = user?._id;
                    const canEdit = task.createdBy?._id === userId || task.createdBy === userId;
                    const canDelete = task.createdBy?._id === userId || task.createdBy === userId;
                    
                    return (
                      <tr key={task._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{task.title}</td>
                        <td className="py-3 px-4">{task.createdBy?.email || '-'}</td>
                        <td className="py-3 px-4">{task.assignedTo?.email || 'Unassigned'}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="py-3 px-4">
                          Est: {task.estimatedTime}h / Act: {task.actualTime || 0}h
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 items-center">
                            <select
                              value={task.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (newStatus === 'completed') {
                                  const actualTime = prompt('Enter actual time taken (hours):');
                                  if (actualTime !== null) {
                                    handleUpdateStatus(task._id, newStatus, parseFloat(actualTime) || 0);
                                  }
                                } else {
                                  handleUpdateStatus(task._id, newStatus);
                                }
                              }}
                              className="text-xs px-2 py-1 border rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            {canEdit && (
                              <button
                                onClick={() => handleEditTask(task)}
                                className="text-primary-600 hover:text-primary-800 text-sm"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
          members={[]}
        />
      </div>
    </div>
  );
};

export default MemberDashboard;

