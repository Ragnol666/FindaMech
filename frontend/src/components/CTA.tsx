import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and mechanics on FindAMech today.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signin" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
            Find a Mechanic
          </Link>
          <Link to="/signup" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Register as Mechanic
          </Link>
        </div>
      </div>
    </section>
  );
}