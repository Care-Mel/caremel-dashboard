import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import ConfirmationModal from "../ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri";

// Static data
const staticUsers = [
  {
    _id: {
      $oid: "67a30b340a2935ea24bbda1f",
    },
    name: "Phyu Lay Nwe",
    NRC: "10/MDN(N)241701",
    __v: 0,
    createdAt: "2025-02-05T17:00:57.469+00:00",
  },
  {
    _id: {
      $oid: "67a31ef60a2935ea24bbda21",
    },
    name: "မထက်ထက်",
    NRC: "12/ဒလန(နိုင်)068611",
    __v: 0,
    createdAt: "2025-02-05T17:00:57.469+00:00",
  },
  {
    _id: {
      $oid: "681b3c0f9f679ef2467cc232",
    },
    name: "Ma Phyo Phyo Khaing",
    NRC: "11/Katala(n)004236",
    createdAt: {
      $date: "2025-05-07T03:24:54.197Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6832e7ca1b67f4cc33553c01",
    },
    name: "မအင်ကြင်းခိုင်",
    NRC: "8/MaLaNa(N)054625",
    createdAt: {
      $date: "2025-05-18T09:53:22.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "683308951b67f4cc33553c03",
    },
    name: "Ma Zue Pyae Sone San",
    NRC: "12/DaGaTa(N)065254",
    createdAt: {
      $date: "2025-05-18T09:53:22.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "683420361b67f4cc33553c66",
    },
    name: "Kyu Kyu Mar",
    NRC: "12/ကတန(နိုင်)၀၆၅၆၈၅",
    createdAt: {
      $date: "2025-05-18T09:53:22.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "683576cf1b67f4cc33553d36",
    },
    name: "မေမြတ်နိုး",
    NRC: "12/lathaya(N)082399",
    createdAt: {
      $date: "2025-05-18T09:53:22.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6835cb701b67f4cc33553e95",
    },
    name: "မသက်ထားရွှေစင်",
    NRC: "၁၂/ဒဂဆနိူင်၀၄၉၂၈၀",
    createdAt: {
      $date: "2025-05-18T09:53:22.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "684231264502deddbd3b620f",
    },
    name: "Aye Myat Mon ",
    NRC: "၁၂/မဘန(နိုင်)၂၂၅၇၆၆",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "684800f54502deddbd3b6222",
    },
    name: "မဝေဝေဖြိုး",
    NRC: "၁၄/ကပန(နိုင်)142197",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "684800f54502deddbd3b6224",
    },
    name: "မဝေဝေဖြိုး",
    NRC: "၁၄/ကပန(နိုင်)142197",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685016cc4502deddbd3b623a",
    },
    name: "အိခွါညို",
    NRC: "13/kalana N130601",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685016cc4502deddbd3b623c",
    },
    name: "အိခွါညို",
    NRC: "13/kalana N130601",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685016cc4502deddbd3b623e",
    },
    name: "အိခွါညို",
    NRC: "13/kalana N130601",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685016cc4502deddbd3b6240",
    },
    name: "အိခွါညို",
    NRC: "13/kalana N130601",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685927094502deddbd3b626a",
    },
    name: "မနွယ်နွယ်လှိုင်",
    NRC: "12/အစနနိုင်(193968)",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685a5f1f4502deddbd3b6288",
    },
    name: "NawCalel ",
    NRC: "၁၄/ဖပန(နိုင်)297128",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685b86f04502deddbd3b628a",
    },
    name: "မစိုးကလျာမိုး",
    NRC: "14/259792",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685bc4384502deddbd3b628c",
    },
    name: "မဇင်မာသင်း",
    NRC: "8/နမန(နိုင်)145860",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685cb9264502deddbd3b6299",
    },
    name: "Nay Nay",
    NRC: "246613",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "685cb9ee4502deddbd3b629b",
    },
    name: "Ma Ei Ei Zar",
    NRC: "12/Thakata(N)167665",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "686142024502deddbd3b62a4",
    },
    name: "Khin Myat Noe Lwin",
    NRC: "7/NTL (naing) 144866",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6862c1654502deddbd3b62a6",
    },
    name: "Nwe Mar Soe",
    NRC: "14/အ မ န (နိုင်) 214862",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6874dddd4502deddbd3b62ab",
    },
    name: "ဟန်နီစိုး",
    NRC: "၇/ညလပ(နိုင်)၂၅၄၉၇၀",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6874ddde4502deddbd3b62ad",
    },
    name: "ဟန်နီစိုး",
    NRC: "၇/ညလပ(နိုင်)၂၅၄၉၇၀",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6874de8d4502deddbd3b62af",
    },
    name: "Han Ni Soe",
    NRC: "7/Nya La Pa(N)254970",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "6874de8e4502deddbd3b62b1",
    },
    name: "Han Ni Soe",
    NRC: "7/Nya La Pa(N)254970",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "689217af4502deddbd3b6317",
    },
    name: "မအိမ့်သဲဖြူ",
    NRC: "၁၂/ဥကမ(နိုင်)၂၉၈၁၃၇",
    createdAt: {
      $date: "2025-06-03T03:20:56.346Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "68aae6c6a018aea366691d4d",
    },
    name: "မသောင်းဆုမြတ်မွန်",
    NRC: "141276",
    createdAt: {
      $date: "2025-08-13T11:12:00.746Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "68b0202fa018aea366691d65",
    },
    name: "မချမ်းမြေ့ကျော်",
    NRC: "၁၂/လသယ(နိုင်)၀၉၄၃၆၃",
    createdAt: {
      $date: "2025-08-13T11:12:00.746Z",
    },
    __v: 0,
  },
];

function TermandCon() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  // Initialize data with static data
  const fetchData = () => {
    setUsers(staticUsers);
    setSearchUser(staticUsers);
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

  const DeleteUser = (id) => {
    try {
      // Filter out the user with the matching ID from static data
      const updatedUsers = users.filter((user) => user._id.$oid !== id);
      setUsers(updatedUsers);
      setSearchUser(updatedUsers);
      toast.success("User deleted successfully");
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
                      {user.createdAt && typeof user.createdAt === "string"
                        ? new Date(user.createdAt).toLocaleDateString()
                        : user.createdAt && user.createdAt.$date
                          ? new Date(user.createdAt.$date).toLocaleDateString()
                          : "N/A"}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                  </td> */}
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
