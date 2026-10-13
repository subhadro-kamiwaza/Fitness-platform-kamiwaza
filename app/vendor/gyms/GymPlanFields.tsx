import { CalendarDays, Check, ChevronDown, IndianRupee } from "lucide-react";
import type { GymPlan } from "@/types";

const DEFAULT_PLANS = ["3 Months", "6 Months", "1 Year"];

const inputCls =
  "w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed";

interface Props {
  planDetails?: GymPlan[] | null;
  disabled?: boolean;
  required?: boolean;
  collapsible?: boolean;
}

export default function GymPlanFields({
  planDetails,
  disabled = false,
  required = true,
  collapsible = false,
}: Props) {
  return (
    <section className="space-y-4 pt-4 border-t border-zinc-800/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <CalendarDays className="w-4 h-4" />
          <span>Membership Plans</span>
        </div>
        <p className="text-xs text-zinc-500">
          Set a price and enter plan features separated by commas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {DEFAULT_PLANS.map((defaultName, index) => {
          const plan = planDetails?.[index];
          const fields = (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300" htmlFor={`plan-name-${index}`}>
                  Plan name
                </label>
                <input
                  id={`plan-name-${index}`}
                  name="plan_name"
                  type="text"
                  required={required}
                  disabled={disabled}
                  defaultValue={plan?.name ?? defaultName}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300" htmlFor={`plan-price-${index}`}>
                  Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id={`plan-price-${index}`}
                    name="plan_price"
                    type="number"
                    min="0"
                    step="0.01"
                    required={required}
                    disabled={disabled}
                    defaultValue={plan?.price ?? ""}
                    placeholder="e.g. 5000"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300" htmlFor={`plan-features-${index}`}>
                  Features
                </label>
                <textarea
                  id={`plan-features-${index}`}
                  name="plan_features"
                  rows={3}
                  required={required}
                  disabled={disabled}
                  defaultValue={plan?.features?.join(", ") ?? ""}
                  placeholder="e.g. Gym access, Personal training, Locker"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </>
          );

          return collapsible ? (
            <details
              key={defaultName}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Plan {index + 1}</span>
                  <span className="font-normal text-zinc-400">· {plan?.name ?? defaultName}</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-3 border-t border-zinc-800 p-4">
                {fields}
              </div>
            </details>
          ) : (
            <div
              key={defaultName}
              className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Plan {index + 1}</span>
              </div>
              {fields}
            </div>
          );
        })}
      </div>
    </section>
  );
}
