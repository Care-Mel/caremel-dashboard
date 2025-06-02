import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "./../../api/axios";
import { toast } from "sonner";
import ConfirmationModal from "../ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri";

function TermandCon() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    const response = await axios.get("api/v1/term-and-condition");
    // console.log("response", response);
    setUsers(response.data.data);
    setSearchUser(response.data.data);
  };

  const onSearch = (searchTerm) => {
    console.log("searchTerm", searchTerm.length);
    // Filter users based on the search term
    if (searchTerm.length > 0) {
      const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchUser(filteredUsers);
    } else if (searchTerm.length == 0) {
      setSearchUser(users);
    }
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
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:px-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms & Conditions Agreements
          </h1>
          <div>
            <div className="relative bg-white flex items-center px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Caregiver "
                onChange={(e) => onSearch(e.target.value)}
                className="w-full ml-10 focus:outline-none"
              />
            </div>
            <p className="text-[16px] text-gray-400">
              You can search booking with caregiver name or date
            </p>
          </div>
        </div>
        <div className="bg-white shadow overflow-x-auto overflow-y-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Caregiver Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  NRC Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Agreement Date
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
              {searchUser.map((user) => (
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
                      className="inline-flex items-center px-4 py-3 bg-transparent hover:bg-red-600/20 text-[#E60000] border border-gray-300 text-[14px] rounded-md transition-colors duration-200"
                    >
                      <RiDeleteBin6Line className="w-4 h-4 mr-3" />
                      Remove
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
