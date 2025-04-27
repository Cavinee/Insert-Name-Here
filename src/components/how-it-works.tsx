export default function HowItWorks() {
    return (
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Cointract Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our blockchain-powered platform makes freelancing simple, secure, and transparent.
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="How Cointract works"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Profile</h3>
                  <p className="text-gray-600">
                    Sign up and create your profile as a freelancer or client. Connect your crypto wallet to enable secure
                    transactions.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Post or Find Projects</h3>
                  <p className="text-gray-600">
                    Clients can post projects with detailed requirements. Freelancers can browse and apply to projects
                    that match their skills.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Contract Agreement</h3>
                  <p className="text-gray-600">
                    Once matched, a blockchain-based smart contract is created that outlines the project scope, timeline,
                    and payment terms.
                  </p>
                </div>
              </div>
  
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Escrow & Payment</h3>
                  <p className="text-gray-600">
                    Clients fund the smart contract escrow. When work is approved, payment is automatically released to
                    the freelancer's wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  