import { createClient } from "@/lib/supabase/server";
import { buildPDFReport } from "@/lib/pdf/buildReport";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: record } = await supabase
      .from("tax_calculations")
      .select("*, profiles(full_name)")
      .eq("tax_id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!record) {
      return new Response("Report not found", { status: 404 });
    }

    const pdfBuffer = await buildPDFReport(record);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=tax-report-${params.id}.pdf`,
      },
    });
  } catch (error) {
    return new Response("Error generating PDF", { status: 500 });
  }
}
