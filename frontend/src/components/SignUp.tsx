import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LocationIcon } from '../icons/gyl-icons';

export default function SignUp() {
  const [userType, setUserType] = useState('user');
  const [useGeolocation, setUseGeolocation] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      phone: '',
      address: '',
      city: '',
      latitude: '',
      longitude: ''
    }
  });

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    setValue('role', type); // Update the form's role field
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setValue('latitude', position.coords.latitude.toString());
        setValue('longitude', position.coords.longitude.toString());
        setUseGeolocation(true);
      }, () => {
        alert('Unable to get your location. Please enter it manually.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const onSubmit = async (data: any) => {
    console.log('SignUp onSubmit called with data:', data);
    console.log('userType:', userType);

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (userType === 'mechanic' && !data.city) {
      alert('Please enter your city');
      return;
    }

    try {
      const submitData: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone
      };

      console.log('Submitting data:', submitData);

      if (userType === 'mechanic') {
        submitData.location = {
          address: data.address,
          city: data.city
        };
        if (data.latitude && data.longitude) {
          submitData.location.coordinates = [
            parseFloat(data.longitude),
            parseFloat(data.latitude)
          ];
        }
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        // Redirect based on user role
        if (userType === 'mechanic') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/customer-dashboard'; // Regular users go to customer dashboard
        }
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error registering');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Join FindAMech</h1>
          <p className="text-center text-gray-600 mb-8">Create your account in seconds</p>

          {/* User Type Selection */}
          <div className="flex gap-4 mb-6">
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition ${
              userType === 'user' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              <input
                type="radio"
                value="user"
                checked={userType === 'user'}
                onChange={(e) => handleUserTypeChange(e.target.value)}
                className="mr-2"
              />
              <span className="font-medium">Customer</span>
            </label>
            <label className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition ${
              userType === 'mechanic' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}>
              <input
                type="radio"
                value="mechanic"
                checked={userType === 'mechanic'}
                onChange={(e) => handleUserTypeChange(e.target.value)}
                className="mr-2"
              />
              <span className="font-medium">Mechanic</span>
            </label>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {userType === 'mechanic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    {...register('city', { required: userType === 'mechanic' ? 'City is required for mechanics' : false })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York, Lagos"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your shop address (optional)"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                  >
                    <LocationIcon className="inline-block mr-1" /> Use My Current Location
                  </button>
                  {useGeolocation && (
                    <p className="text-sm text-green-600 mt-2">✓ Location captured</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition mt-6"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="text-blue-600 hover:text-blue-700 font-bold">
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-600 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}