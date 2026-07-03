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

    const { data: record, error } = await supabase
      .from("tax_calculations")
      .select("*")
      .eq("tax_id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Database error in PDF route:", JSON.stringify(error, null, 2));
      return new Response("Database error", { status: 500 });
    }

    if (!record) {
      console.error("Report not found for ID:", id, "User:", user.id);
      return new Response("Report not found", { status: 404 });
    }

    // Get profile separately
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const recordWithProfile = { ...record, profiles: profile };

    const pdfBuffer = await buildPDFReport(recordWithProfile);

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
