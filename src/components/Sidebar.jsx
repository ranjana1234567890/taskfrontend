import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
      : "";
  };

  const getDashboardPath = () => {
    if (user?.role === "superadmin") return "/dashboard/superadmin";
    if (user?.role === "organization") return "/dashboard/organization";
    if (user?.role === "member") return "/dashboard/member";
    return "/login";
  };

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-600">TaskManager</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          {user?.role || "User"}
        </p>
      </div>

      <nav className="flex-1 p-4">
        <Link
          to={getDashboardPath()}
          className={`block px-4 py-3 rounded-lg mb-2 transition-colors ${
            isActive(getDashboardPath()) || "hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </span>
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
