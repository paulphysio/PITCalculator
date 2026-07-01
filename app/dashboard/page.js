import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Please log in to access your dashboard</p>
          <Link href="/login" className="text-green-600 font-semibold hover:underline text-sm sm:text-base">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const { data: calculations } = await supabase
    .from("tax_calculations")
    .select("*")
    .eq("user_id", user.id)
    .order("calculation_date", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your tax calculations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Calculations</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{calculations?.length || 0}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tax Calculated</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700 text-sm sm:text-base">
                  ₦{calculations?.reduce((sum, c) => sum + c.annual_tax, 0).toLocaleString() || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Average Monthly Tax</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700 text-sm sm:text-base">
                  ₦{calculations?.length 
                    ? (calculations.reduce((sum, c) => sum + c.monthly_tax, 0) / calculations.length).toLocaleString()
                    : 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Calculation Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/calculator"
            className="inline-flex items-center bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <span className="mr-2">+</span> New Calculation
          </Link>
        </div>

        {/* Calculations List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Calculations</h2>
          </div>
          
          {calculations && calculations.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {calculations.map((calc) => (
                  <div key={calc.tax_id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(calc.calculation_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{calc.gross_income.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Annual Tax</p>
                        <p className="text-sm font-bold text-green-700">
                          ₦{calc.annual_tax.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Chargeable</p>
                        <p className="text-sm text-gray-900">₦{calc.chargeable_income.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Monthly</p>
                        <p className="text-sm font-semibold text-blue-700">₦{calc.monthly_tax.toLocaleString()}</p>
                      </div>
                    </div>
                    <Link
                      href={`/reports/${calc.tax_id}`}
                      className="block text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                    >
                      View Report
                    </Link>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gross Income
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chargeable Income
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annual Tax
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Tax
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calculations.map((calc) => (
                      <tr key={calc.tax_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(calc.calculation_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{calc.gross_income.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{calc.chargeable_income.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                          ₦{calc.annual_tax.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                          ₦{calc.monthly_tax.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/reports/${calc.tax_id}`}
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">📋</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No calculations yet</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Start by calculating your first tax</p>
              <Link
                href="/calculator"
                className="inline-flex items-center bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Calculate Tax
              </Link>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">About Nigerian Tax Bands</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Nigeria uses a progressive tax system with 6 tax bands ranging from 0% to 25%. 
              The higher your income, the higher the tax rate applied to income within each band.
            </p>
            <Link href="/" className="text-green-600 font-semibold hover:underline text-sm sm:text-base">
              Learn more on our home page →
            </Link>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              If you have questions about tax deductions or calculations, 
              consult the Nigerian tax authorities or a tax professional.
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              This calculator is for informational purposes only and should not replace professional tax advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
