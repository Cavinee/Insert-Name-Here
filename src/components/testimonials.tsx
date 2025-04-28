import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Cointract has transformed how I work with clients. The smart contracts ensure I always get paid for completed work, and the instant payments are a game-changer.",
    author: "Sarah Johnson",
    role: "Graphic Designer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a client, I love the transparency and security. The escrow system gives me confidence, and I've saved thousands in fees compared to traditional platforms.",
    author: "Michael Chen",
    role: "Startup Founder",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The blockchain verification of my work history has helped me land higher-paying clients. They can see my verified track record without relying on just reviews.",
    author: "Emily Rodriguez",
    role: "Web Developer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from freelancers and clients who are thriving on our blockchain-powered platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
