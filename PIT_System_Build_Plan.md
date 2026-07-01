# Nigerian Personal Income Tax Calculation System
## Build Plan — Next.js + Supabase + JavaScript

Based on your project spec and Chapter 4 (Supabase version), translated into a real Next.js architecture.

---

## 1. Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router), JavaScript only | You specified this; App Router gives you Server Components + Server Actions, so you barely need a separate Express backend |
| Auth + DB | Supabase (Postgres + Auth) | Matches your Chapter 4 update; Supabase Auth replaces your custom "Users table with password" design — more secure, less code |
| Styling | Tailwind CSS | Fast to build clean, presentable screenshots for Chapter 4 |
| Validation | `zod` + `react-hook-form` | Matches your "Validation Module" requirement (required fields, numeric, non-negative, email format) |
| PDF Report | `@react-pdf/renderer` (or `pdfkit` in a route handler) | Matches your "downloadable receipt" goal from Chapter 1 |
| Hosting | Vercel (app) + Supabase Cloud (DB/Auth) | Free tier covers an academic prototype |

**Important design correction from your draft spec:** don't store a custom `password` column in a `Users` table. Supabase Auth (`auth.users`) already handles secure password hashing, sessions, and login/logout. You keep a `profiles` table for the *extra* fields (full name, phone) linked 1:1 to `auth.users.id`. This is both more secure and less work — and it's a completely reasonable thing to describe in Chapter 4 as "the User Module leverages Supabase's built-in authentication service."

---

## 2. Project Structure

```
pit-calculator/
├─ app/
│  ├─ layout.js                     # root layout, fonts, nav
│  ├─ page.js                       # Home page (Figure 4.1)
│  ├─ globals.css
│  ├─ (auth)/
│  │  ├─ register/page.js           # Figure 4.2
│  │  └─ login/page.js              # Figure 4.3
│  ├─ dashboard/
│  │  ├─ page.js                    # list of past calculations
│  │  └─ layout.js                  # auth-guarded layout
│  ├─ calculator/
│  │  ├─ page.js                    # tax input form (Figure 4.4)
│  │  └─ actions.js                 # server action: validate + calculate + save
│  ├─ reports/
│  │  ├─ [id]/page.js               # generated report view (Figure 4.6/4.7)
│  │  └─ [id]/pdf/route.js          # GET -> streams PDF
│  └─ api/
│     └─ tax-bands/route.js         # optional: expose current bands as JSON
├─ lib/
│  ├─ supabase/
│  │  ├─ client.js                  # browser client
│  │  ├─ server.js                  # server client (cookies-based)
│  │  └─ middleware.js              # session refresh helper
│  ├─ tax/
│  │  ├─ calculateTax.js            # core engine
│  │  └─ schema.js                  # zod validation schema
│  └─ pdf/
│     └─ buildReport.js
├─ components/
│  ├─ TaxForm.jsx
│  ├─ ResultCard.jsx
│  ├─ TaxBreakdownTable.jsx
│  └─ Navbar.jsx
├─ middleware.js                    # protects /dashboard, /calculator, /reports
├─ jsconfig.json
├─ tailwind.config.js
└─ .env.local
```

---

## 3. Supabase Database Schema

Run this in the Supabase SQL editor. It mirrors your spec's `Users` / `Tax_Calculation` / `Tax_Bands` tables, adapted to Supabase Auth.

```sql
-- 1. Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone_number text,
  created_at timestamptz default now()
);

-- 2. Tax bands (Nigeria Tax Act 2025) — seeded once, editable if the law changes
create table tax_bands (
  band_id serial primary key,
  min_income numeric not null,
  max_income numeric,              -- null = no upper limit
  tax_rate numeric not null,       -- e.g. 0.15 for 15%
  band_order int not null
);

insert into tax_bands (min_income, max_income, tax_rate, band_order) values
  (0,          800000,    0.00, 1),
  (800000,     3000000,   0.15, 2),
  (3000000,    12000000,  0.18, 3),
  (12000000,   25000000,  0.21, 4),
  (25000000,   50000000,  0.23, 5),
  (50000000,   null,      0.25, 6);

-- 3. Tax calculations
create table tax_calculations (
  tax_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  gross_income numeric not null,
  pension_contribution numeric default 0,
  nhf_contribution numeric default 0,
  life_assurance_premium numeric default 0,
  total_deductions numeric not null,
  chargeable_income numeric not null,
  annual_tax numeric not null,
  monthly_tax numeric not null,
  calculation_date timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table tax_calculations enable row level security;
alter table tax_bands enable row level security;

create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users manage own calculations" on tax_calculations
  for all using (auth.uid() = user_id);

create policy "Anyone can read tax bands" on tax_bands
  for select using (true);

-- Auto-create profile row on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone_number');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Storing `tax_bands` in the DB (instead of hardcoding) directly answers the "Legislative Fluidity" limitation in your Chapter 1 — if the bands change, you edit a row, not the code.

---

## 4. Core Tax Engine (`lib/tax/calculateTax.js`)

This is a **marginal/progressive** calculation — each band only taxes the slice of income that falls inside it, which is what your Chapter 4 validation example actually does.

```js
export function calculateTax(chargeableIncome, bands) {
  let tax = 0;
  const breakdown = [];

  for (const band of bands) {
    if (chargeableIncome <= band.min_income) break;

    const upper = band.max_income ?? Infinity;
    const taxableInBand = Math.min(chargeableIncome, upper) - band.min_income;

    if (taxableInBand > 0) {
      const bandTax = taxableInBand * band.tax_rate;
      tax += bandTax;
      breakdown.push({
        range: `₦${band.min_income.toLocaleString()} - ${
          band.max_income ? "₦" + band.max_income.toLocaleString() : "above"
        }`,
        rate: band.tax_rate,
        taxableAmount: taxableInBand,
        taxCharged: bandTax,
      });
    }
  }

  return {
    annualTax: Math.round(tax * 100) / 100,
    monthlyTax: Math.round((tax / 12) * 100) / 100,
    breakdown,
  };
}

export function calculateDeductions({ pension = 0, nhf = 0, lifeAssurance = 0 }) {
  return pension + nhf + lifeAssurance;
}
```

**Validate against your own thesis data before building UI around it** — TC2 from Chapter 4:
Gross ₦2,400,000, deductions ₦236,000 → chargeable ₦2,164,000 → annual tax ₦204,600 → monthly ₦17,050. Write this as your first Jest test.

---

## 5. Validation Schema (`lib/tax/schema.js`)

```js
import { z } from "zod";

export const taxInputSchema = z.object({
  grossIncome: z.coerce.number().positive("Gross income must be greater than 0"),
  pensionContribution: z.coerce.number().min(0, "Cannot be negative").default(0),
  nhfContribution: z.coerce.number().min(0, "Cannot be negative").default(0),
  lifeAssurancePremium: z.coerce.number().min(0, "Cannot be negative").default(0),
}).refine(
  (data) =>
    data.pensionContribution + data.nhfContribution + data.lifeAssurancePremium <=
    data.grossIncome,
  { message: "Total deductions cannot exceed gross income" }
);

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

This satisfies your Validation Module list directly: required fields, numeric checks, non-negative checks, email format, and a logical check (deductions vs. income).

---

## 6. Auth Setup

`lib/supabase/client.js`
```js
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

`lib/supabase/server.js`
```js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) =>
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  );
}
```

Registration (Server Action):
```js
"use server";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/tax/schema";

export async function registerUser(formData) {
  const parsed = registerSchema.parse(Object.fromEntries(formData));
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: { full_name: parsed.fullName, phone_number: parsed.phoneNumber },
    },
  });

  if (error) return { error: error.message };
  return { success: true };
}
```

`middleware.js` — protect `/dashboard`, `/calculator`, `/reports`:
```js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) =>
          list.forEach(({ name, value }) => response.cookies.set(name, value)),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/calculator", "/reports"];
  if (!user && protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/calculator/:path*", "/reports/:path*"] };
```

---

## 7. Calculator Flow (`app/calculator/actions.js`)

```js
"use server";
import { createClient } from "@/lib/supabase/server";
import { taxInputSchema } from "@/lib/tax/schema";
import { calculateTax, calculateDeductions } from "@/lib/tax/calculateTax";

export async function submitTaxCalculation(formData) {
  const parsed = taxInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { grossIncome, pensionContribution, nhfContribution, lifeAssurancePremium } = parsed.data;
  const totalDeductions = calculateDeductions({
    pension: pensionContribution,
    nhf: nhfContribution,
    lifeAssurance: lifeAssurancePremium,
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
      life_assurance_premium: lifeAssurancePremium,
      total_deductions: totalDeductions,
      chargeable_income: chargeableIncome,
      annual_tax: annualTax,
      monthly_tax: monthlyTax,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, taxId: data.tax_id, breakdown };
}
```

Redirect to `/reports/[taxId]` on success — this is your Figure 4.5/4.6 result screen.

---

## 8. Report Generation (PDF)

`app/reports/[id]/pdf/route.js` (route handler streaming a PDF using `pdfkit`):

```js
import PDFDocument from "pdfkit";
import { createClient } from "@/lib/supabase/server";

export async function GET(request, { params }) {
  const supabase = createClient();
  const { data: record } = await supabase
    .from("tax_calculations")
    .select("*, profiles(full_name)")
    .eq("tax_id", params.id)
    .single();

  const doc = new PDFDocument();
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(18).text("Nigerian Personal Income Tax Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Taxpayer: ${record.profiles.full_name}`);
  doc.text(`Gross Annual Income: ₦${record.gross_income.toLocaleString()}`);
  doc.text(`Total Deductions: ₦${record.total_deductions.toLocaleString()}`);
  doc.text(`Chargeable Income: ₦${record.chargeable_income.toLocaleString()}`);
  doc.text(`Annual Tax: ₦${record.annual_tax.toLocaleString()}`);
  doc.text(`Monthly Tax: ₦${record.monthly_tax.toLocaleString()}`);
  doc.text(`Date: ${new Date(record.calculation_date).toLocaleDateString()}`);
  doc.end();

  await new Promise((resolve) => doc.on("end", resolve));
  const pdfBuffer = Buffer.concat(chunks);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=tax-report-${params.id}.pdf`,
    },
  });
}
```

---

## 9. Build Order (do it in this sequence)

1. **Scaffold**: `npx create-next-app@latest pit-calculator` → choose JavaScript, App Router, Tailwind. `npm i @supabase/ssr @supabase/supabase-js zod react-hook-form pdfkit`.
2. **Supabase project**: create it, run the SQL in Section 3, copy URL + anon key into `.env.local`.
3. **Auth**: build register/login pages + middleware. Test signup/login manually in Supabase Auth dashboard.
4. **Tax engine**: write `calculateTax.js` first as a pure function, unit-test it against your Chapter 4 test cases (TC1–TC4) before touching any UI.
5. **Calculator page + form**: wire `TaxForm.jsx` to the server action, show validation errors inline.
6. **Save + report**: persist to `tax_calculations`, build the result/report page and PDF route.
7. **Dashboard**: list a user's past calculations (`select * from tax_calculations where user_id = auth.uid()`).
8. **Polish UI**: this is where your Chapter 4 screenshots (Figures 4.1–4.9) get captured — home, register, login, tax input, validation error, result, report, and the Supabase table views themselves (Figures 4.7–4.9 in your updated chapter literally want screenshots of the Supabase dashboard tables).
9. **Testing**: write Jest tests for `calculateTax` reproducing your TC1–TC4 table exactly, plus a couple of edge cases (zero income, income exactly on a band boundary).
10. **Deploy**: push to GitHub → import into Vercel → add the same env vars → done.

---

## 10. Mapping to Your Chapter 4 Screenshots

| Figure | Page | Notes |
|---|---|---|
| 4.1 | `/` | Home page |
| 4.2 | `/register` | Registration form |
| 4.3 | `/login` | Login form |
| 4.4 | `/calculator` | Tax input form |
| 4.5 | `/calculator` (error state) | Submit with one field empty |
| 4.6 | `/reports/[id]` | Result screen using the ₦2,400,000 example |
| 4.7 | `/reports/[id]` | Full report / PDF download |
| 4.7–4.9 (Supabase figs) | Supabase Table Editor | Screenshot `profiles`, `tax_calculations`, `tax_bands` tables directly in the Supabase dashboard |

---

## 11. Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

No service role key needed client-side — RLS handles per-user access on its own.
