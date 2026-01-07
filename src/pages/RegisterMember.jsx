// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const RegisterMember = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     phoneNumber: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const { registerMember } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const result = await registerMember(formData);

//     if (result.success) {
//       navigate('/dashboard/member');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-primary-600 mb-2">Register as Member</h1>
//           <p className="text-gray-600">Create your member account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Username *
//             </label>
//             <input
//               type="text"
//               value={formData.username}
//               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password *
//             </label>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               required
//               minLength={6}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={formData.phoneNumber}
//               onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterMember;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RegisterMember = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    organizationId: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { registerMember } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fetch organizations on page load
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/organizations");
        console.log(res, "resres1212");
        setOrganizations(res.data);
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await registerMember(formData);

    if (result.success) {
      navigate("/dashboard/member");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            Register as Member
          </h1>
          <p className="text-gray-600">Create your member account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* 🔹 Organization Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization *
            </label>
            <select
              required
              value={formData.organizationId}
              onChange={(e) =>
                setFormData({ ...formData, organizationId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMember;
