
const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "100+", label: "AI Projects" },
    { number: "50+", label: "Weekly Winners" },
    { number: "1000+", label: "Points Awarded" }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 
          className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" 
          data-aos="fade-up"
        >
          Our Impact
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              data-aos="zoom-in" 
              data-aos-delay={index * 100}
              className="p-4 md:p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all group"
            >
              <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
