import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "./../../api/axios";
import { toast } from "sonner";
import ConfirmationModal from "../ConfirmationModal";

function TermandCon() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [users, setUsers] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    const response = await axios.get("api/v1/term-and-condition");
    // console.log("response", response);
    setUsers(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DeleteUser = async (id) => {
    try {
      const res = await axios.delete(`api/v1/term-and-condition/${id}`);
      // console.log(res);
      if (res.status === 200) {
        toast.success("User deleted successfully");
        fetchData();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const handleDelete = () => {
    if (userIdToDelete) {
      DeleteUser(userIdToDelete);
      setModalVisible(false);
      setUserIdToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
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
                  NRC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CreateAt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    <div className="text-sm font-medium text-gray-900">
                      {user.NRC}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
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

      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleDelete}
        onCancel={() => {
          setModalVisible(false);
          setUserIdToDelete(null);
        }}
      />
    </div>
  );
}

export default TermandCon;
