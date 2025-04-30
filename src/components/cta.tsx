export default function CTA() {
    return (
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join the Future of Freelancing</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Whether you're looking to hire top talent or find exciting projects, Cointract connects you with
              opportunities worldwide with the security of blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-md transition-colors font-medium"
              >
                Find Talent
              </a>
              <a
                href="#"
                className="bg-gray-800 text-white hover:bg-gray-900 px-8 py-3 rounded-md transition-colors font-medium"
              >
                Find Work
              </a>
            </div>
            <p className="text-emerald-100 text-sm mt-6">
              Connect your crypto wallet and start working in minutes. No credit card required.
            </p>
          </div>
        </div>
      </section>
    )
  }
  