import { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

interface Booking {
  _id: string;
  user: { name: string; phone: string };
  mechanic: { name: string; phone: string; shopAddress?: string };
  service: { name: string; price: number };
  date: string;
  status: string;
  notes?: string;
}

function decodeRoleFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const role = decodeRoleFromToken();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else if (response.status === 401) {
        // if unauthorized, clear token and redirect
        localStorage.removeItem('token');
        window.location.href = '/signin';
      } else {
        alert('Failed to load bookings');
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, paymentReference?: string) => {
    try {
      const token = localStorage.getItem('token');
      const payload: any = { status };
      if (paymentReference) {
        payload.paymentReference = paymentReference;
        payload.paymentStatus = 'completed';
      }
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Booking updated successfully!');
        loadBookings();
      } else {
        alert('Could not update booking');
      }
    } catch {
      alert('Error updating booking');
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking._id, 'completed', reference);
      setSelectedBooking(null);
    }
  };

  const openPaymentModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setPaymentOpen(true);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Please sign in to view your bookings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                {role === 'mechanic' ? (
                  <>
                    <h3 className="font-bold">{booking.user.name}</h3>
                    <p className="text-gray-600">{booking.user.phone}</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold">{booking.mechanic.name}</h3>
                    <p className="text-gray-600">{booking.mechanic.phone}</p>
                    {booking.mechanic.shopAddress && (
                      <p className="text-sm text-gray-500">{booking.mechanic.shopAddress}</p>
                    )}
                  </>
                )}
                <p className="text-sm text-gray-500">
                  Service: {booking.service.name} - ₦{booking.service.price}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(booking.date).toLocaleDateString()}
                </p>
                {booking.notes && (
                  <p className="text-sm text-gray-700 mt-2">Notes: {booking.notes}</p>
                )}

                {role === 'mechanic' && booking.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {role === 'user' && booking.status === 'confirmed' && (
                  <div className="mt-4">
                    <button
                      onClick={() => openPaymentModal(booking)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Complete & Pay
                    </button>
                  </div>
                )}

                <span className={`px-3 py-1 rounded-full text-sm mt-2 inline-block ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>{booking.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <PaymentModal
          isOpen={paymentOpen}
          amount={selectedBooking.service.price}
          email={userEmail}
          bookingId={selectedBooking._id}
          serviceName={selectedBooking.service.name}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setPaymentOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}