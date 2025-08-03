const testimonials = [
  {
    name: "Dr. Sarah Martinez",
    role: "Dean of Student Affairs",
    institution: "University of California",
    avatar: "/placeholder.svg",
    content:
      "StudentFlow has completely transformed our clearance process. What used to take weeks now takes just days. Our students are happier, and our staff is more efficient.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Senior Student",
    institution: "MIT",
    avatar: "/placeholder.svg",
    content:
      "As a graduating student, I can't imagine going through clearance the old way. Everything is transparent, fast, and I always know exactly what I need to do next.",
    rating: 5,
  },
  {
    name: "Prof. Emily Johnson",
    role: "Registrar",
    institution: "Stanford University",
    avatar: "/placeholder.svg",
    content:
      "The analytics and reporting features give us insights we never had before. We can identify bottlenecks and improve our processes continuously.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-100 lg:px-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Trusted by Leading
            <span className="text-blue-600"> Institutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what educators and students are saying about their experience
            with StudentFlow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-yellow-400"
                    >
                      <path d="M12 .587l3.668 7.571L24 9.748l-6 5.854 1.42 8.281L12 18.896l-7.42 4.987L6 15.602 0 9.748l8.332-1.59z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-800 mb-6 leading-relaxed">
                  “{testimonial.content}”
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                    <span className="absolute">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="mt-1 inline-block bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
