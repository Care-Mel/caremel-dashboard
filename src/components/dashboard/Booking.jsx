"use client";

import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "./../../api/axios.js";
import filter from "../../assets/filter.svg";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => (
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
      placeholder="Search Booking"
      onChange={(e) => onSearch(e.target.value)}
      className="w-full ml-10 focus:outline-none"
    />
  </div>
);

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

const ServiceFilter = ({
  services,
  selectedService,
  onServiceChange,
  bookings,
}) => {
  // Calculate unseen counts for each service
  const getUnseenCount = (service) => {
    if (service === "") {
      // For "All Services", count all unseen bookings
      return bookings.filter((booking) => !booking.isSeen).length;
    }
    return bookings.filter(
      (booking) => booking.service === service && !booking.isSeen
    ).length;
  };

  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex space-x-8 overflow-x-auto">
        <button
          onClick={() => onServiceChange("")}
          className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 relative flex items-center ${
            selectedService === ""
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Services
          {getUnseenCount("") > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
              {getUnseenCount("")}
            </span>
          )}
          {selectedService === "" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#121212]"></div>
          )}
        </button>
        {services.map((service) => {
          const unseenCount = getUnseenCount(service);
          return (
            <button
              key={service}
              onClick={() => onServiceChange(service)}
              className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 relative flex items-center ${
                selectedService === service
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {service}
              {unseenCount > 0 ? (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                  {unseenCount}
                </span>
              ) : null}
              {selectedService === service && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#121212]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ServiceFilter.propTypes = {
  services: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedService: PropTypes.string.isRequired,
  onServiceChange: PropTypes.func.isRequired,
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const FilterDropdown = ({ options, value, onChange, label }) => (
  <div className="px-3 py-2 flex gap-2 items-center  w-full text-primary rounded-lg border bg-white">
    <img src={filter} alt="filter" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent focus:outline-none appearance-none px-2"
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

FilterDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const formatDateTime = (dateTimeString) => {
  try {
    // Remove extra spaces and normalize the format
    const normalized = dateTimeString.trim().replace(/\s+/g, " ");
    const parts = normalized.split(" ");

    if (parts.length < 2) {
      throw new Error("Invalid format");
    }

    const datePart = parts[0]; // YYYY-MM-DD
    const timePart = parts[1]; // HH:MM:SS
    const period = parts[2] || ""; // AM/PM (optional)

    // Parse the date
    const [year, month, day] = datePart.split("-");

    // Month names array
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get month name (subtract 1 because array is 0-indexed)
    const monthName = monthNames[Number.parseInt(month) - 1];

    if (!monthName) {
      throw new Error("Invalid month");
    }

    // Parse the time
    const [hours, minutes] = timePart.split(":");

    // Format the result: "Jun 04, 2025  , 02 : 06 PM"
    const formattedDate = `${monthName} ${day.padStart(2, "0")}, ${year}`;
    const formattedTime = `${hours.padStart(2, "0")} : ${minutes.padStart(
      2,
      "0"
    )} ${period}`;

    return `${formattedDate}  , ${formattedTime}`;
  } catch (error) {
    throw new Error("Please use format: YYYY-MM-DD HH:MM:SS AM/PM");
  }
};

const BookingTable = ({
  bookings,
  handleDelete,
  handleViewDetails,
  handleMarkAsSeen,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider hidden md:table-cell">
              Address
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider">
              Booking Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider hidden sm:table-cell">
              Township
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[#121212] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                booking?.isSeen ? "" : "bg-green-50"
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Patient: {booking.patientInformation[0]?.patientName}
                  </div>

                  {/* <div className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {booking.service}
                    </span>
                  </div> */}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.phoneNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                <div className="max-w-xs truncate">
                  {booking.address || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  {formatDateTime(booking.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                {booking.township}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleViewDetails(booking._id);
                      handleMarkAsSeen(booking._id);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary hover:bg-green-600 text-white text-[14px] rounded-md transition-colors duration-200"
                  >
                    <FaEye className="w-4 h-4 mr-3" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="inline-flex items-center px-4 py-2 bg-transparent hover:bg-red-600/20 text-[#E60000] border border-gray-300 text-[14px] rounded-md transition-colors duration-200"
                  >
                    <RiDeleteBin6Line className="w-4 h-4 mr-3" />
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      township: PropTypes.string.isRequired,
      startingDate: PropTypes.string.isRequired,
      endingDate: PropTypes.string.isRequired,
      address: PropTypes.string,
      patientInformation: PropTypes.arrayOf(
        PropTypes.shape({
          patientName: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleViewDetails: PropTypes.func.isRequired,
  handleMarkAsSeen: PropTypes.func.isRequired,
};

// Mock data for preview
// const mockBookings = [
//   {
//     _id: "1",
//     name: "Poe Poe Han Hlaing",
//     service: "Care",
//     phoneNumber: "09591131",
//     township: "Kamayut",
//     startingDate: "2023-06-04T12:06:00.000Z",
//     endingDate: "2023-06-10T12:06:00.000Z",
//     address: "123A Shaw Tharaphi Street Piti",
//     patientInformation: [{ patientName: "Tun" }],
//   },
//   {
//     _id: "2",
//     name: "Thunder Oo",
//     service: "Air Care",
//     phoneNumber: "09756650952",
//     township: "Thaketa",
//     startingDate: "2023-05-25T09:43:00.000Z",
//     endingDate: "2023-05-30T09:43:00.000Z",
//     address: "No.5 urban street Aung Thapyay Road 9 gate Botahtaung",
//     patientInformation: [{ patientName: "Aung" }],
//   },
//   {
//     _id: "3",
//     name: "Yatanar",
//     service: "Ethan",
//     phoneNumber: "09500175343",
//     township: "Kamayut",
//     startingDate: "2023-05-23T14:49:00.000Z",
//     endingDate: "2023-05-28T14:49:00.000Z",
//     address: "99/31 Baho street 3 Ward Hlaadan near one discount",
//     patientInformation: [{ patientName: "Ethan" }],
//   },
// ];

const Booking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [townshipFilter, setTownshipFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [deletedBookingId, setDeletedBookingId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleMarkAsSeen = async (bookingId) => {
    const data = {
      isSeen: true,
    };
    const response = await axios.patch(
      `/api/v1/customer-form/${bookingId}`,
      data
    );
    if (response.data.code === 200) {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, isSeen: true } : booking
        )
      );
    }
    // console.log(response);
  };

  // For a real implementation, uncomment this to fetch data

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("api/v1/customer-form");
        setBookings(response.data.data.customerForms);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const townships = [...new Set(bookings.map((booking) => booking.township))];

  const services = [...new Set(bookings.map((booking) => booking.service))];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phoneNumber.includes(searchTerm) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTownship =
      townshipFilter === "" || booking.township === townshipFilter;

    const matchesService =
      serviceFilter === "" || booking.service === serviceFilter;

    return matchesSearch && matchesTownship && matchesService;
  });

  const handleViewDetails = (bookingId) => {
    navigate(`/dashboard/bookings/${bookingId}`);
  };

  const DeleteBooking = async () => {
    console.log("Delete booking function called");
    try {
      const response = await axios.delete(
        `/api/v1/customer-form/${deletedBookingId}`
      );
      console.log("Booking deleted successfully:", response.data);
      if (response.data.code === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== deletedBookingId)
        );
      }
      setDeletedBookingId(null);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Booking Requests</h1>

          <div className="w-full sm:w-80">
            <SearchBar onSearch={setSearchTerm} />
            {/* <p>You can search booking with customer name or phone number</p> */}
          </div>

          <div className="w-full sm:w-48">
            <FilterDropdown
              options={townships}
              value={townshipFilter}
              onChange={setTownshipFilter}
              label="Township Filter"
            />
          </div>
        </div>
      </div>

      <ServiceFilter
        services={services}
        selectedService={serviceFilter}
        onServiceChange={setServiceFilter}
        bookings={bookings}
      />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No bookings found matching your criteria
          </p>
        </div>
      ) : (
        <BookingTable
          bookings={filteredBookings}
          handleDelete={(bookingId) => {
            setDeletedBookingId(bookingId);
            setShowDeleteConfirmation(true);
          }}
          handleViewDetails={handleViewDetails}
          handleMarkAsSeen={handleMarkAsSeen}
        />
      )}

      {/* Simple mock of ConfirmationModal for preview */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeletedBookingId(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={DeleteBooking}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
