const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800'
    },
    inprogress: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800'
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-800'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

