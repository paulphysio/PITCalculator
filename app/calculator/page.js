"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CalculatorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    grossIncome: "",
    pensionContribution: "",
    nhfContribution: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setErrors(data.error);
        } else {
          setErrors({ general: data.error || "Calculation failed" });
        }
        return;
      }

      router.push(`/reports/${data.taxId}`);
    } catch (err) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Tax Calculator
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            Calculate your Personal Income Tax according to Nigerian tax laws
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="grossIncome" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Gross Annual Income (₦)
                </label>
                <input
                  id="grossIncome"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.grossIncome}
                  onChange={(e) => setFormData({ ...formData, grossIncome: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="e.g., 2400000"
                />
                {errors.grossIncome && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.grossIncome}</p>
                )}
              </div>

              <div>
                <label htmlFor="pensionContribution" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Pension Contribution (₦)
                </label>
                <input
                  id="pensionContribution"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pensionContribution}
                  onChange={(e) => setFormData({ ...formData, pensionContribution: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="e.g., 180000"
                />
                {errors.pensionContribution && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.pensionContribution}</p>
                )}
              </div>

              <div>
                <label htmlFor="nhfContribution" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  NHF Contribution (₦)
                </label>
                <input
                  id="nhfContribution"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.nhfContribution}
                  onChange={(e) => setFormData({ ...formData, nhfContribution: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="e.g., 30000"
                />
                {errors.nhfContribution && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.nhfContribution}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Calculating..." : "Calculate Tax"}
              </button>
            </form>
          </div>

          {/* Right Side - Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Tax Deductions</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                The following deductions are allowed under Nigerian tax law:
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Pension contributions (up to 8% of gross income)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">National Housing Fund (NHF) contributions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">How It Works</h3>
              <ol className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">1</span>
                  <span>Enter your gross annual income</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">2</span>
                  <span>Add any applicable deductions</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">3</span>
                  <span>System calculates chargeable income</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">4</span>
                  <span>Tax is applied progressively across bands</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">5</span>
                  <span>View detailed breakdown and download PDF</span>
                </li>
              </ol>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
                alt="Tax calculation"
                width={800}
                height={400}
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
