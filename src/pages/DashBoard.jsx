import axios from "./../api/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import TermandCon from "../components/dashboard/TermandCon";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    const response = await axios.get("api/v1/term-and-condition");
    console.log(response.data);
    setUsers(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`api/v1/term-and-condition/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <TermandCon users={users} onDeleteUser={handleDelete} />
    </div>
  );
};

export default Dashboard;
