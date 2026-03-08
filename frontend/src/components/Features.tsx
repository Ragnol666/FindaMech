import { LocationIcon, StarIcon, CalendarIcon, MoneyIcon, LockIcon, MobileIcon } from '../icons/gyl-icons';

export default function Features() {
  const features = [
    {
      icon: <LocationIcon className="text-4xl" />, 
      title: 'Location-Based Search',
      description: 'Find mechanics near you instantly with our smart location detection.'
    },
    {
      icon: <StarIcon className="text-4xl" />,
      title: 'Verified Reviews',
      description: 'Check authentic ratings and reviews from real customers.'
    },
    {
      icon: <CalendarIcon className="text-4xl" />,
      title: 'Easy Booking',
      description: 'Schedule appointments in seconds with confirmed availability.'
    },
    {
      icon: <MoneyIcon className="text-4xl" />,
      title: 'Transparent Pricing',
      description: 'See upfront quotes before confirming your booking.'
    },
    {
      icon: <LockIcon className="text-4xl" />,
      title: '100% Secure',
      description: 'Your data is protected with military-grade encryption.'
    },
    {
      icon: <MobileIcon className="text-4xl" />,
      title: 'Mobile Friendly',
      description: 'Access FindAMech anytime, anywhere on any device.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose FindAMech?</h2>
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}