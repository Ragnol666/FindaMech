import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="pt-40 pb-20 bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6">Find Your Trusted Mechanic</h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with verified mechanics in your area. Book appointments, get instant quotes, and maintain your vehicle with confidence.
            </p>
            <div className="flex gap-4">
              <Link to="/signin" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition block text-center">
                Find Mechanics
              </Link>
              <Link to="/signup" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-600 transition block text-center">
                I'm a Mechanic
              </Link>
            </div>
          </div>
          <div className="bg-blue-400 rounded-lg h-96 overflow-hidden">
            <img 
              src="https://www.shutterstock.com/image-photo/young-african-american-mechanic-working-600nw-2099017543.jpg" 
              alt="African mechanic with spanner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}