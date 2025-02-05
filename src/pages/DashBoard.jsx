import axios from "./../api/axios";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const ConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white p-6 rounded shadow-md z-50"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
      >
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  // Simulating API call
  const fetchData = async () => {
    const response = await axios.get("api/v1/term-and-condition");
    setUsers(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (userIdToDelete) {
      const res = await axios.delete(
        `api/v1/term-and-condition/${userIdToDelete}`
      );
      if (res.status === 200) {
        toast.success("User deleted successfully");
        fetchData();
        setModalVisible(false);
        setUserIdToDelete(null);
      } else {
        toast.error("Failed to delete user");
      }

      // Reset user id after deletion
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user._id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setUserIdToDelete(user._id);
                          setModalVisible(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                      >
                        <FaTrash className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render Confirmation Modal */}
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Dashboard;
