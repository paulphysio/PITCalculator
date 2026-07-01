import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-white py-12 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Nigerian Personal Income Tax Calculator
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                Calculate your tax accurately according to the latest Nigerian tax laws. 
                Fast, accurate, and completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/calculator"
                  className="bg-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
                >
                  Calculate Your Tax Now
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-green-600 text-green-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-center text-sm sm:text-base"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
                alt="Tax calculation illustration"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16">
            Why Choose Our Calculator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">🎯</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Accurate Calculations</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Based on the latest Nigerian tax bands and regulations for 2025
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">⚡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Instant Results</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get your tax breakdown in seconds with detailed band analysis
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">📊</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Detailed Reports</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Download professional PDF reports for your records
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Bands Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Current Tax Bands (2025)
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg">
            Progressive tax rates based on annual chargeable income
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-green-600">0%</span>
                <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">First ₦800,000</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">No tax on the first ₦800,000 of income</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">15%</span>
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">₦800K - ₦3M</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Next ₦2.2 million taxed at 15%</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-purple-600">18%</span>
                <span className="text-xs sm:text-sm bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full">₦3M - ₦12M</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Next ₦9 million taxed at 18%</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-orange-600">21%</span>
                <span className="text-xs sm:text-sm bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full">₦12M - ₦25M</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Next ₦13 million taxed at 21%</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-red-600">23%</span>
                <span className="text-xs sm:text-sm bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full">₦25M - ₦50M</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Next ₦25 million taxed at 23%</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-gray-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl sm:text-2xl font-bold text-gray-600">25%</span>
                <span className="text-xs sm:text-sm bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 rounded-full">Above ₦50M</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Income above ₦50 million taxed at 25%</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
                1
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Create Account</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Sign up for free in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
                2
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Enter Income</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Input your gross annual income</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
                3
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Add Deductions</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Include pension, NHF, and insurance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
                4
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Get Results</h3>
              <p className="text-gray-600 text-xs sm:text-sm">View breakdown and download PDF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16">
            Trusted by Nigerian Professionals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop"
                alt="Business professional"
                width={400}
                height={300}
                className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop"
                alt="Financial planning"
                width={400}
                height={300}
                className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop"
                alt="Office workspace"
                width={400}
                height={300}
                className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                alt="Data analysis"
                width={400}
                height={300}
                className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Calculate Your Tax?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8">
            Join thousands of Nigerians who trust our calculator for accurate tax computations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/calculator"
              className="bg-white text-green-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base"
            >
              Start Calculating
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">🇳🇬 PIT Calculator</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Accurate Nigerian Personal Income Tax calculations based on current tax laws.
              </p>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Home</Link></li>
                <li><Link href="/calculator" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Calculator</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><span className="text-gray-400 text-sm sm:text-base">Privacy Policy</span></li>
                <li><span className="text-gray-400 text-sm sm:text-base">Terms of Service</span></li>
                <li><span className="text-gray-400 text-sm sm:text-base">Contact Us</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2025 Nigerian PIT Calculator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
