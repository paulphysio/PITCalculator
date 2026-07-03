import { createClient } from "@/lib/supabase/server";
import { calculateTax } from "@/lib/tax/calculateTax";
import Link from "next/link";

export default async function ReportPage({ params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Please log in to view this report</p>
          <Link href="/login" className="text-green-600 font-semibold hover:underline text-sm sm:text-base">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const { data: record, error } = await supabase
    .from("tax_calculations")
    .select("*")
    .eq("tax_id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Database error:", JSON.stringify(error, null, 2));
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <p className="text-red-600 mb-4 text-sm sm:text-base">Database error: {JSON.stringify(error)}</p>
          <p className="text-gray-600 mb-4 text-sm">Please ensure you have run the SQL setup script in Supabase.</p>
          <Link href="/dashboard" className="text-green-600 font-semibold hover:underline text-sm sm:text-base">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get profile separately if record exists
  let profile = null;
  if (record) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = profileData;
  }

  if (!record) {
    console.error("Report not found for ID:", id, "User:", user.id);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Report not found</p>
          <p className="text-gray-500 mb-4 text-xs">ID: {id}</p>
          <p className="text-gray-500 mb-4 text-xs">User: {user.id}</p>
          <Link href="/dashboard" className="text-green-600 font-semibold hover:underline text-sm sm:text-base">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { data: bands } = await supabase
    .from("tax_bands")
    .select("*")
    .order("band_order");

  const { breakdown } = calculateTax(record.chargeable_income, bands);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Tax Report</h1>
            <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">
              Generated on {new Date(record.calculation_date).toLocaleDateString()}
            </p>
          </div>

          {/* Taxpayer Info */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Taxpayer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Name</p>
                <p className="text-base sm:text-lg font-medium text-gray-900">{profile?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Report ID</p>
                <p className="text-base sm:text-lg font-medium text-gray-900">{record.tax_id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          {/* Income Summary */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Income Summary</h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Gross Annual Income</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  ₦{record.gross_income.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">Pension Contribution</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  ₦{record.pension_contribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm sm:text-base">NHF Contribution</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  ₦{record.nhf_contribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-green-50 px-3 sm:px-4 rounded-lg">
                <span className="text-gray-900 font-semibold text-sm sm:text-base">Total Deductions</span>
                <span className="text-base sm:text-lg font-bold text-green-700">
                  ₦{record.total_deductions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-blue-50 px-3 sm:px-4 rounded-lg mt-3 sm:mt-4">
                <span className="text-gray-900 font-semibold text-sm sm:text-base">Chargeable Income</span>
                <span className="text-base sm:text-lg font-bold text-blue-700">
                  ₦{record.chargeable_income.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Tax Breakdown by Band</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Income Range</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Rate</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Taxable Amount</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Tax Charged</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((band, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900">{band.range}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900">{(band.rate * 100).toFixed(0)}%</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900">
                        ₦{band.taxableAmount.toLocaleString()}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 font-semibold">
                        ₦{band.taxCharged.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Tax */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Annual Tax</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700">
                  ₦{record.annual_tax.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Monthly Tax</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                  ₦{record.monthly_tax.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center">
            <Link
              href="/calculator"
              className="text-green-600 font-semibold hover:underline text-sm sm:text-base"
            >
              Calculate Another Tax
            </Link>
            <a
              href={`/reports/${id}/pdf`}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              Download PDF Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
