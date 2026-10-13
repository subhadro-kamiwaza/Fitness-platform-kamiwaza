import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertCircle, Check, CheckCircle2, Clock, FileText, IndianRupee } from "lucide-react";
import type { GymPlan, GymStatus } from "@/types";
import GymEditForm from "./GymEditForm";

function isGymPlanDetails(value: unknown): value is GymPlan[] {
  return (
    Array.isArray(value) &&
    value.every(
      (plan) =>
        typeof plan === "object" &&
        plan !== null &&
        "name" in plan &&
        typeof plan.name === "string" &&
        "price" in plan &&
        typeof plan.price === "number" &&
        "features" in plan &&
        Array.isArray(plan.features) &&
        plan.features.every((feature: unknown) => typeof feature === "string")
    )
  );
}

const STATUS_MESSAGES: Partial<Record<GymStatus, { text: string; icon: typeof Clock; style: string }>> = {
  DRAFT: {
    text: "This application is currently in Draft. You can update details and submit it for admin audit whenever ready.",
    icon: FileText,
    style: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  },
  PENDING: {
    text: "Your application has been submitted and is currently in the audit queue awaiting review.",
    icon: Clock,
    style: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  UNDER_REVIEW: {
    text: "An administrator is currently inspecting your facility details and verification documents.",
    icon: Clock,
    style: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  APPROVED: {
    text: "Your facility has passed audit! It will be published live to members shortly.",
    icon: CheckCircle2,
    style: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  },
  LIVE: {
    text: "Your gym listing is live! Members can discover your facility, pricing, and contact info.",
    icon: CheckCircle2,
    style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  REJECTED: {
    text: "Your application was rejected. Please review your details, update the information, and resubmit.",
    icon: AlertCircle,
    style: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GymDetailPage({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = await params;
  const vendor = await getVendorForUser();
  if (!vendor) redirect("/become-vendor");

  const supabase = await createClient();
  const { data: gym } = await supabase
    .from("gyms")
    .select("*")
    .eq("id", gymId)
    .eq("vendor_id", vendor.id)
    .single();

  if (!gym) redirect("/vendor/dashboard");

  const rawPlanDetails: unknown = gym.plan_details;
  const planDetails = isGymPlanDetails(rawPlanDetails) ? rawPlanDetails : [];
  const isEditable = gym.status === "DRAFT" || gym.status === "REJECTED";
  const statusInfo = STATUS_MESSAGES[gym.status as GymStatus];

  return (
    <div className="site-container py-10 space-y-8">
      <PageHeader
        title={gym.name}
        description={`Facility ID: ${gym.id.slice(0, 8)}...`}
        breadcrumbs={[
          { label: "Vendor Portal", href: "/vendor/dashboard" },
          { label: gym.name },
        ]}
        badge={<StatusBadge status={gym.status} />}
      />
			<div className="max-w-3xl flex flex-col justify-start gap-y-4">

      {statusInfo && (
        <div className={`rounded-2xl border p-4 backdrop-blur-md flex items-start gap-3 text-sm ${statusInfo.style}`}>
          <statusInfo.icon className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{statusInfo.text}</p>
        </div>
      )}

      <div className="relative  overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        <GymEditForm gym={gym} isEditable={isEditable} />
      </div>
			</div>
      {planDetails.length > 0 && (
        <section className=" space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Membership Plans</h2>
            <p className="mt-1 text-sm text-zinc-400">Your gym profile plan preview</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planDetails.map((plan, planIndex) => (
              <article
                key={`${plan.name}-${planIndex}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg"
              >
                <h3 className="font-semibold text-white">{plan.name}</h3>
                <p className="mt-3 flex items-center gap-1 text-2xl font-bold text-emerald-400">
                  <IndianRupee className="h-5 w-5" />
                  {Number(plan.price).toLocaleString("en-IN")}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={`${plan.name}-${index}`} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
			
    </div>
  );
}
