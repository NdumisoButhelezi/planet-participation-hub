
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" 
          data-aos="fade-up"
        >
          What Our Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div data-aos="fade-up" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
            </div>
            <p className="text-gray-700 mb-4">"PlutoDev transformed how I learn machine learning. The gamification makes studying enjoyable and the challenges keep me engaged."</p>
            <div className="font-medium">- Sarah J., Data Scientist</div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="100" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
            </div>
            <p className="text-gray-700 mb-4">"The weekly challenges pushed me to improve my coding skills rapidly. The community is supportive and inspiring."</p>
            <div className="font-medium">- Marcus T., Software Engineer</div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
              <Star className="text-yellow-500 w-5 h-5" />
            </div>
            <p className="text-gray-700 mb-4">"The practical projects helped me build a strong portfolio and land my dream job in AI. Highly recommended for serious learners."</p>
            <div className="font-medium">- Aisha R., AI Researcher</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
