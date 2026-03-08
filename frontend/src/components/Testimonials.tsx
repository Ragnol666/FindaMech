import { StarIcon } from '../icons/gyl-icons';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Car Owner',
      text: 'FindAMech made finding a reliable mechanic so easy! I booked within minutes.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Mechanic',
      text: 'Great platform to reach customers. I\'ve grown my business significantly.',
      rating: 5
    },
    {
      name: 'Emily Chen',
      role: 'Car Owner',
      text: 'Transparent pricing and instant notifications. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">What People Say</h2>
        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 border border-gray-200 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}