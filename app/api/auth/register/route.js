import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/tax/schema";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: { full_name: parsed.fullName, phone_number: parsed.phoneNumber },
      },
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error.name === "ZodError") {
      return Response.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
