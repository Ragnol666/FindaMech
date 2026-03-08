import { useState, useEffect } from 'react';
import { LocationIcon, StarIcon, WhatsappIcon, MobileIcon } from '../icons/gyl-icons';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../lib/api';

interface Mechanic {
  _id: string;
  name: string;
  email: string;
  phone: string;
  shopAddress?: string;
  location: {
    coordinates: [number, number];
  };
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

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAllMechanics, setShowAllMechanics] = useState(true);

  const { register: registerBooking, handleSubmit: handleBookingSubmit, reset: resetBooking } = useForm();

  useEffect(() => {
    loadUserData();
    loadMechanics();
  }, []);

  useEffect(() => {
    loadMechanics();
  }, [showAllMechanics]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      const response = await fetch(apiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getUserLocation = () => {
    console.log('Getting user location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location obtained:', location);
          setUserLocation(location);
          if (!showAllMechanics) {
            loadNearbyMechanics(location);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to a location (e.g., Lagos, Nigeria)
          const defaultLocation = { lat: 6.5244, lng: 3.3792 };
          console.log('Using default location:', defaultLocation);
          setUserLocation(defaultLocation);
          if (!showAllMechanics) {
            loadNearbyMechanics(defaultLocation);
          }
        }
      );
    } else {
      console.log('Geolocation not supported, using default location');
      // Default location if geolocation not supported
      const defaultLocation = { lat: 6.5244, lng: 3.3792 };
      setUserLocation(defaultLocation);
      if (!showAllMechanics) {
        loadNearbyMechanics(defaultLocation);
      }
    }
  };

  const loadNearbyMechanics = async (location: { lat: number; lng: number }) => {
    try {
      console.log('Fetching nearby mechanics for location:', location);
      const response = await fetch(
        apiUrl(`/api/mechanics/nearby?lat=${location.lat}&lng=${location.lng}&maxDistance=50000`)
      );
      console.log('Nearby mechanics response:', response);

      if (response.ok) {
        const mechanicsData = await response.json();
        console.log('Nearby mechanics data:', mechanicsData);
        setMechanics(mechanicsData);
      } else {
        console.error('Failed to load nearby mechanics:', response.status);
      }
    } catch (error) {
      console.error('Error loading nearby mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMechanics = async () => {
    try {
      console.log('Fetching all mechanics...');
      const response = await fetch(apiUrl('/api/mechanics/all'));
      console.log('All mechanics response:', response);

      if (response.ok) {
        const mechanicsData = await response.json();
        console.log('All mechanics data:', mechanicsData);
        setMechanics(mechanicsData);
      } else {
        console.error('Failed to load all mechanics:', response.status);
      }
    } catch (error) {
      console.error('Error loading all mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMechanics = async () => {
    setLoading(true);
    console.log('Loading mechanics, showAllMechanics:', showAllMechanics, 'userLocation:', userLocation);
    if (showAllMechanics) {
      await loadAllMechanics();
    } else if (userLocation) {
      await loadNearbyMechanics(userLocation);
    } else {
      // If no location and not showing all, get location first
      console.log('Getting user location...');
      getUserLocation();
    }
  };

  const openBookingModal = (mechanic: Mechanic, service: Service) => {
    setSelectedMechanic(mechanic);
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setSelectedMechanic(null);
    setSelectedService(null);
    setShowBookingModal(false);
    resetBooking();
  };

  const onBookingSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        mechanicId: selectedMechanic!._id,
        serviceId: selectedService!._id,
        date: data.date,
        notes: data.notes
      };

      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Booking request sent successfully! The mechanic will contact you soon.');
        closeBookingModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create booking');
      }
    } catch (error) {
      alert('Error creating booking');
    }
  };

  const contactOnWhatsApp = (mechanic: Mechanic) => {
    const message = `Hi ${mechanic.name}, I found you on FindAMech and I'm interested in your services.`;
    const whatsappUrl = `https://wa.me/${mechanic.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const calculateDistance = (mechanicLocation: [number, number]) => {
    if (!userLocation || showAllMechanics) return 'Distance unavailable';

    const [lng, lat] = mechanicLocation;
    const R = 6371; // Earth's radius in km
    const dLat = (lat - userLocation.lat) * Math.PI / 180;
    const dLng = (lng - userLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Finding mechanics near you...</p>
        </div>
      </div>
    );
  }

  if (!user) {
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
          <h1 className="text-2xl font-bold text-gray-900">FindAMech - Customer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={() => {
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mechanics Near You</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {showAllMechanics 
                ? 'Showing all available mechanics' 
                : `Showing mechanics within 50km of your location`
              }
            </p>
            <button
              onClick={() => setShowAllMechanics(!showAllMechanics)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showAllMechanics ? 'Show Nearby Only' : 'Show All Mechanics'}
            </button>
          </div>
        </div>

        {mechanics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No mechanics found in your area.</p>
            <p className="text-gray-400 mt-2">Try refreshing or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((mechanic) => (
              <div key={mechanic._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Mechanic Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{mechanic.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarIcon className="text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {mechanic.rating.toFixed(1)} ({mechanic.reviews.length} reviews)
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <LocationIcon /> {calculateDistance(mechanic.location.coordinates)} away
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => contactOnWhatsApp(mechanic)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                      >
                        <WhatsappIcon /> WhatsApp
                      </button>
                    </div>
                  </div>

                  {mechanic.shopAddress && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1"><LocationIcon /> {mechanic.shopAddress}</p>
                  )}
                  <p className="text-sm text-gray-600 flex items-center gap-1"><MobileIcon /> {mechanic.phone}</p>
                </div>

                {/* Services */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Available Services</h4>
                  {mechanic.services.length === 0 ? (
                    <p className="text-sm text-gray-500">No services listed yet</p>
                  ) : (
                    <div className="space-y-3">
                      {mechanic.services.slice(0, 3).map((service) => (
                        <div key={service._id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{service.name}</h5>
                              <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                            <span className="font-bold text-green-600">₦{service.price}</span>
                          </div>
                          <button
                            onClick={() => openBookingModal(mechanic, service)}
                            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      ))}
                      {mechanic.services.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{mechanic.services.length - 3} more services
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Reviews */}
                {mechanic.reviews.length > 0 && (
                  <div className="px-6 pb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Recent Reviews</h4>
                    <div className="space-y-2">
                      {mechanic.reviews.slice(0, 2).map((review) => (
                        <div key={review._id} className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="font-medium">{review.user.name}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <StarIcon key={i} className="text-yellow-400 text-xs" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMechanic && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Book Service</h3>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedMechanic.name}</p>
                <p className="text-sm text-gray-600">{selectedService.name}</p>
                <p className="text-lg font-bold text-green-600">₦{selectedService.price}</p>
              </div>

              <form onSubmit={handleBookingSubmit(onBookingSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    {...registerBooking('date', { required: 'Date is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...registerBooking('notes')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special instructions or vehicle details..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Send Booking Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
