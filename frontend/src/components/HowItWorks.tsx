export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Enter Your Location',
      description: 'Tell us where you are or allow location access.'
    },
    {
      number: '2',
      title: 'Browse Mechanics',
      description: 'Browse nearby mechanics with ratings and services.'
    },
    {
      number: '3',
      title: 'Check Availability',
      description: 'View available time slots and book your appointment.'
    },
    {
      number: '4',
      title: 'Get Service',
      description: 'Visit the mechanic or they come to you. Get instant support.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}