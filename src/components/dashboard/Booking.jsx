import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
import ConfirmationModal from "../ConfirmationModal";

const SearchBar = ({ onSearch }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search by name, phone, or service..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
    <svg
      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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
  </div>
);

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

const FilterDropdown = ({ options, value, onChange, label }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
  >
    <option value="" disabled>
      {label}
    </option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

FilterDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const BookingCard = ({ booking, handleDelete }) => (
  <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-md md:text-lg font-semibold text-gray-800">
              {booking.name}
            </h3>
            <span className="px-2 py-1 text-center text-xs font-medium rounded-full bg-green-100 text-green-800">
              {booking.service}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              {booking.phoneNumber}
            </p>
            <p className="flex items-center">
              <LocationIcon className="w-4 h-4 mr-2" />
              {booking.township}
            </p>
            <p className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {format(new Date(booking.startingDate), "MMM dd, yyyy")} -{" "}
              {format(new Date(booking.endingDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:items-end justify-between">
          <Link
            to={`/dashboard/bookings/${booking._id}`}
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            View Details
            <ArrowIcon className="w-4 h-4 ml-2" />
          </Link>
          <div className="mt-4 sm:mt-auto text-sm text-gray-500">
            Patient: {booking.patientInformation[0].patientName}
          </div>
        </div>
      </div>
    </div>
    <button className="absolute top-[-15px] right-[-15px] bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded-lg transition-colors duration-200">
      <MdDelete
        size={25}
        onClick={() => {
          handleDelete(booking._id);
        }}
      />
    </button>
  </div>
);

BookingCard.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    township: PropTypes.string.isRequired,
    startingDate: PropTypes.string.isRequired,
    endingDate: PropTypes.string.isRequired,
    patientInformation: PropTypes.arrayOf(
      PropTypes.shape({
        patientName: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [townshipFilter, setTownshipFilter] = useState("");
  const [deletedBookingId, setDeletedBookingId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("api/v1/customer-form");
        setBookings(response.data.data.customerForms.reverse());
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const services = [...new Set(bookings.map((booking) => booking.service))];
  const townships = [...new Set(bookings.map((booking) => booking.township))];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phoneNumber.includes(searchTerm) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      serviceFilter === "" || booking.service === serviceFilter;
    const matchesTownship =
      townshipFilter === "" || booking.township === townshipFilter;

    return matchesSearch && matchesService && matchesTownship;
  });

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
    <div className="p-5 container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Booking Requests
        </h1>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
          <div className="col-span-12 lg:col-span-6">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <FilterDropdown
              options={services}
              value={serviceFilter}
              onChange={setServiceFilter}
              label="Filter by Service"
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <FilterDropdown
              options={townships}
              value={townshipFilter}
              onChange={setTownshipFilter}
              label="Filter by Township"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No bookings found matching your criteria
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              handleDelete={() => {
                setDeletedBookingId(booking._id);
                setShowDeleteConfirmation(true);
                // console.log(booking._id);
              }}
            />
          ))
        )}
      </div>

      {/* {showDeleteConfirmation && ( */}
      <ConfirmationModal
        isVisible={showDeleteConfirmation}
        onConfirm={DeleteBooking}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setDeletedBookingId(null);
        }}
      />
    </div>
  );
};

// Icon components
const PhoneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Add PropTypes for icon components
PhoneIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

LocationIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

CalendarIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

ArrowIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

export default Booking;
