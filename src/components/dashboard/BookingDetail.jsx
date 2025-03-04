import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import { format } from "date-fns";

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = await axios.get(`api/v1/customer-form/${id}`);
        setBooking(response.data.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Booking not found
          </h2>
          <Link
            to="/dashboard"
            className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const InfoCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-1">
      <span className="font-medium text-gray-600 min-w-[140px]">{label}:</span>
      <span className="text-gray-800 mt-1 sm:mt-0">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center  justify-between mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-green-800 font-bold hover:text-green-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Bookings
          </Link>
          <div className="text-sm w-auto mt-5 sm:mt-0 bg-green-100 text-green-800 px-5 py-2 rounded-full">
            Booking ID: <span className="font-bold ms-2">{booking._id}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard title="Customer Information">
            <InfoItem label="Name" value={booking.name} />
            <InfoItem label="Phone" value={booking.phoneNumber} />
            <InfoItem label="Township" value={booking.township} />
            <InfoItem label="Address" value={booking.address} />
            <InfoItem label="Bus Stop" value={booking.busStop} />
          </InfoCard>

          <InfoCard title="Service Details">
            <InfoItem label="Service Type" value={booking.service} />
            <InfoItem
              label="Start Date"
              value={`${format(
                new Date(booking.startingDate),
                "MMM dd, yyyy"
              )} at ${booking.startingTime}`}
            />
            <InfoItem
              label="End Date"
              value={`${format(
                new Date(booking.endingDate),
                "MMM dd, yyyy"
              )} at ${booking.endingTime}`}
            />
            <InfoItem
              label="Meal Support"
              value={booking.careGiverMealSupport ? "Yes" : "No"}
            />
          </InfoCard>

          {booking.patientInformation.map((patient) => (
            <InfoCard key={patient._id} title="Patient Information">
              <InfoItem label="Name" value={patient.patientName} />
              <InfoItem label="Age" value={patient.patientAge} />
              <InfoItem label="Gender" value={patient.patientGender} />
              <InfoItem label="Religion" value={patient.religious} />
            </InfoCard>
          ))}

          {booking.patientStatus.map((status) => (
            <InfoCard key={status._id} title="Patient Status">
              <InfoItem
                label="Infectious Disease"
                value={status.haveInfectiousDisease ? "Yes" : "No"}
              />
              {status.infectiousDiseaseName && (
                <InfoItem
                  label="Disease Name"
                  value={status.infectiousDiseaseName}
                />
              )}
              <InfoItem
                label="Hard of Hearing"
                value={status.hardHearing ? "Yes" : "No"}
              />
              <InfoItem
                label="Mobility Level"
                value={status.mobilityLevelDescription}
              />
              <InfoItem
                label="Chronic Diseases"
                value={status.chronicDiseaseName}
              />
            </InfoCard>
          ))}
        </div>

        {booking.additionalNote && (
          <div className="mt-6">
            <InfoCard title="Additional Notes">
              <p className="text-gray-700 whitespace-pre-wrap">
                {booking.additionalNote}
              </p>
            </InfoCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
