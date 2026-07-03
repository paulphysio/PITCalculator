import { createClient } from "@/lib/supabase/server";
import { taxInputSchema } from "@/lib/tax/schema";
import { calculateTax, calculateDeductions } from "@/lib/tax/calculateTax";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = taxInputSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { grossIncome, pensionContribution, nhfContribution } = parsed.data;
    const totalDeductions = calculateDeductions({
      pension: pensionContribution,
      nhf: nhfContribution,
      lifeAssurance: 0,
    });
    const chargeableIncome = grossIncome - totalDeductions;

    const { data: bands } = await supabase
      .from("tax_bands")
      .select("*")
      .order("band_order");

    const { annualTax, monthlyTax, breakdown } = calculateTax(chargeableIncome, bands);

    const { data, error } = await supabase
      .from("tax_calculations")
      .insert({
        user_id: user.id,
        gross_income: grossIncome,
        pension_contribution: pensionContribution,
        nhf_contribution: nhfContribution,
        life_assurance_premium: 0,
        total_deductions: totalDeductions,
        chargeable_income: chargeableIncome,
        annual_tax: annualTax,
        monthly_tax: monthlyTax,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, taxId: data.tax_id, breakdown });
  } catch (error) {
    return Response.json({ error: "Calculation failed" }, { status: 500 });
  }
}
