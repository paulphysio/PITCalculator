import { createClient } from "@/lib/supabase/server";
import { buildPDFReport } from "@/lib/pdf/buildReport";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: record } = await supabase
      .from("tax_calculations")
      .select("*, profiles(full_name)")
      .eq("tax_id", id)
      .eq("user_id", user.id)
      .single();

    if (!record) {
      console.error("Report not found for ID:", id, "User:", user.id);
      return new Response("Report not found", { status: 404 });
    }

    const pdfBuffer = await buildPDFReport(record);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=tax-report-${id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}
