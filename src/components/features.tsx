import { Shield, DollarSign, Clock, FileText } from "lucide-react"

const features = [
  {
    icon: <Shield size={24} className="text-emerald-600" />,
    title: "Secure Transactions",
    description:
      "All payments are secured by blockchain technology, ensuring your money and work are protected at all times.",
  },
  {
    icon: <DollarSign size={24} className="text-emerald-600" />,
    title: "Lower Fees",
    description:
      "By eliminating middlemen, we charge significantly lower fees than traditional freelance platforms - just 3%.",
  },
  {
    icon: <Clock size={24} className="text-emerald-600" />,
    title: "Instant Payments",
    description:
      "Get paid instantly when work is approved. No more waiting days or weeks for payment processing and transfers.",
  },
  {
    icon: <FileText size={24} className="text-emerald-600" />,
    title: "Smart Contracts",
    description: "Our blockchain-based smart contracts automatically enforce agreement terms, protecting both parties.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Cointract</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our blockchain-powered platform revolutionizes how freelancers and clients work together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 p-2 bg-emerald-50 inline-block rounded-lg">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
