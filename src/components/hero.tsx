export default function Hero() {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Freelancing Powered by <span className="text-emerald-600">Blockchain</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with top talent and clients worldwide. Secure payments, transparent contracts, and zero middlemen
                fees through blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md transition-colors text-center font-medium"
                >
                  Find Talent
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md transition-colors text-center font-medium"
                >
                  Find Work
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Blockchain freelance marketplace"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
  