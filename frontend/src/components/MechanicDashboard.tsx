import { useState, useEffect } from 'react';
import { StarIcon } from '../icons/gyl-icons';
import { useForm } from 'react-hook-form';

interface Mechanic {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    coordinates: [number, number];
  };
  shopAddress?: string;
  services: Service[];
  rating: number;
  reviews: Review[];
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
}

interface Booking {
  _id: string;
  user: {
    name: string;
    phone: string;
  };
  service: Service;
  date: string;
  status: string;
  notes?: string;
}

export default function MechanicDashboard() {
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm();
  const { register: registerService, handleSubmit: handleServiceSubmit, reset: resetService } = useForm();

  useEffect(() => {
    loadMechanicData();
  }, []);

  const loadMechanicData = async () => {
    console.log('MechanicDashboard: Loading mechanic data...');
    try {
      const token = localStorage.getItem('token');
      console.log('MechanicDashboard: Token exists:', !!token);
      if (!token) {
        console.log('MechanicDashboard: No token, redirecting to signin');
        window.location.href = '/signin';
        return;
      }

      // Load mechanic profile
      const profileResponse = await fetch('http://localhost:5000/api/mechanics/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const mechanicData = await profileResponse.json();
        setMechanic(mechanicData);
        setServices(mechanicData.services || []);
        setReviews(mechanicData.reviews || []);
      } else {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        return;
      }

      // Load bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

    } catch (error) {
      console.error('Error loading mechanic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onProfileUpdate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mechanics/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        loadMechanicData();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const onServiceAdd = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Service added successfully!');
        resetService();
        loadMechanicData();
      } else {
        alert('Failed to add service');
      }
    } catch (error) {
      alert('Error adding service');
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Service deleted successfully!');
        loadMechanicData();
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      alert('Error deleting service');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert('Booking status updated!');
        loadMechanicData();
      } else {
        alert('Failed to update booking');
      }
    } catch (error) {
      alert('Error updating booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Please log in to access your dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mechanic Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {mechanic.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'services' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'bookings' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'reviews' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Reviews
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        {...registerProfile('name')}
                        defaultValue={mechanic.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        {...registerProfile('email')}
                        defaultValue={mechanic.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        {...registerProfile('phone')}
                        defaultValue={mechanic.phone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                      <input
                        type="text"
                        {...registerProfile('shopAddress')}
                        defaultValue={mechanic.shopAddress}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {/* Add Service Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Add New Service</h2>
                  <form onSubmit={handleServiceSubmit(onServiceAdd)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                          type="text"
                          {...registerService('name', { required: 'Service name is required' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Oil Change"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...registerService('price', { required: 'Price is required' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="50.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        {...registerService('category')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="oil-change">Oil Change</option>
                        <option value="brake-repair">Brake Repair</option>
                        <option value="tire-service">Tire Service</option>
                        <option value="engine-repair">Engine Repair</option>
                        <option value="transmission">Transmission</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        {...registerService('description')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the service..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Add Service
                    </button>
                  </form>
                </div>

                {/* Services List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Your Services</h2>
                  {services.length === 0 ? (
                    <p className="text-gray-500">No services added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{service.name}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-sm text-gray-500">Category: {service.category}</p>
                            <p className="text-lg font-bold text-green-600">₦{service.price}</p>
                          </div>
                          <button
                            onClick={() => deleteService(service._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Booking Requests</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-500">No bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold">{booking.user.name}</h3>
                            <p className="text-gray-600">{booking.user.phone}</p>
                            <p className="text-sm text-gray-500">
                              Service: {booking.service.name} - ₦{booking.service.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(booking.date).toLocaleDateString()}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-gray-700 mt-2">Notes: {booking.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
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
                              </>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-2xl" />
                    <span className="text-xl font-bold">{mechanic.rating.toFixed(1)}</span>
                    <span className="text-gray-600">({reviews.length} reviews)</span>
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold">{review.user.name}</span>
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <StarIcon key={i} className="text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}