import { getUser, getProfile } from "@/lib/supabase/session";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/logout/action";
import { SubmitButton } from "@/components/ui/submit-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { User, Mail, Phone, MapPin, Calendar, Shield, Store, LogOut, ArrowRight, Sparkles, Info } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
	const [user, profile] = await Promise.all([getUser(), getProfile()]);
	if (!user) redirect("/login");

	const initial =
		profile?.full_name?.[0]?.toUpperCase() ??
		user.email?.[0]?.toUpperCase() ??
		"U";

	const memberDate = new Date(profile?.created_at ?? user.created_at).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div className="site-container py-10 space-y-6">
			{/* Breadcrumb Navigation */}
			<Breadcrumb items={[{ label: "My Profile" }]} />

			{/* Main Profile Card */}
			<div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
				{/* Left Column: User Profile Card */}
				<div className="relative w-full lg:w-1/2 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 space-y-8 flex flex-col justify-between">
					<div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

					<div className="space-y-8">
						{/* Avatar & Header */}
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-zinc-800/60">
							<div className="relative">
								<div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-zinc-950 text-3xl font-extrabold shadow-xl shadow-emerald-500/20">
									{initial}
								</div>
								<div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-zinc-900 flex items-center justify-center">
									<Sparkles className="w-2.5 h-2.5 text-zinc-950" />
								</div>
							</div>

							<div className="space-y-1.5 text-center sm:text-left flex-1">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<h1 className="text-2xl font-bold text-white tracking-tight">
										{profile?.full_name || "Fitness Member"}
									</h1>
									<span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit mx-auto sm:mx-0">
										<Shield className="w-3 h-3" />
										{profile?.role ?? "USER"}
									</span>
								</div>
								<p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
									<Mail className="w-3.5 h-3.5 text-zinc-500" />
									<span>{profile?.email ?? user.email}</span>
								</p>
							</div>
						</div>

						{/* Personal Details Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<Phone className="w-3.5 h-3.5 text-emerald-400" />
									<span>Phone Number</span>
								</div>
								<p className="text-sm font-medium text-zinc-200">{profile?.phone || "Not provided"}</p>
							</div>

							<div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<MapPin className="w-3.5 h-3.5 text-emerald-400" />
									<span>Location / Address</span>
								</div>
								<p className="text-sm font-medium text-zinc-200">{profile?.address || "Not provided"}</p>
							</div>

							<div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<Calendar className="w-3.5 h-3.5 text-emerald-400" />
									<span>Member Since</span>
								</div>
								<p className="text-sm font-medium text-zinc-200">{memberDate}</p>
							</div>

							<div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<Shield className="w-3.5 h-3.5 text-emerald-400" />
									<span>Account Status</span>
								</div>
								<p className="text-sm font-medium text-emerald-400">Verified Active</p>
							</div>
						</div>

						{/* Role Navigation Actions */}
						<div className="space-y-3 pt-2">
							{profile?.role === "USER" && (
								<Link
									href="/become-vendor"
									className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm transition-all group"
								>
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
											<Store className="w-4 h-4" />
										</div>
										<div>
											<p className="text-white font-semibold">Become a Gym Vendor</p>
											<p className="text-xs text-emerald-400/80 font-normal">List and manage your fitness center on the platform</p>
										</div>
									</div>
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							)}

							{profile?.role === "VENDOR" && (
								<Link
									href="/vendor/dashboard"
									className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm transition-all group"
								>
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
											<Store className="w-4 h-4" />
										</div>
										<div>
											<p className="text-white font-semibold">Go to Vendor Dashboard</p>
											<p className="text-xs text-emerald-400/80 font-normal">View submissions and manage facilities</p>
										</div>
									</div>
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							)}

							{profile?.role === "ADMIN" && (
								<Link
									href="/admin/dashboard"
									className="flex items-center justify-between p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-sm transition-all group"
								>
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
											<Shield className="w-4 h-4" />
										</div>
										<div>
											<p className="text-white font-semibold">Go to Admin Dashboard</p>
											<p className="text-xs text-teal-400/80 font-normal">Review applications, audit gyms and vendors</p>
										</div>
									</div>
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							)}
						</div>
					</div>

					{/* Logout Form with Loading Button */}
					<div className="pt-4 border-t border-zinc-800/60">
						<form action={logout}>
							<SubmitButton
								variant="destructive"
								loadingText="Logging out..."
								icon={<LogOut className="w-4 h-4" />}
								className="w-full py-3 rounded-xl"
							>
								Log Out of Account
							</SubmitButton>
						</form>
					</div>
				</div>

				{/* Right Column: Matching Instructions Card */}
				<div className="relative w-full lg:w-1/2 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 flex flex-col justify-between">
					<div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

					<div className="space-y-6">
						{/* Header */}
						<div className="pb-6 border-b border-zinc-800/60 flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
									<Info className="w-6 h-6 text-emerald-400" />
									Instructions
								</h2>
								<p className="text-xs text-muted-foreground mt-1">
									Lorem ipsum dolor sit amet text guide
								</p>
							</div>
							<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
								Guide
							</span>
						</div>

						{/* Bullet Items */}
						<ul className="space-y-4">
							<li className="flex gap-3 text-sm text-zinc-300 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
									1
								</span>
								<p className="leading-snug">
									<strong className="text-white block font-medium">Lorem Ipsum Dolor</strong>
									Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
								</p>
							</li>

							<li className="flex gap-3 text-sm text-zinc-300 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
									2
								</span>
								<p className="leading-snug">
									<strong className="text-white block font-medium">Ullamco Laboris Nisi</strong>
									Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
								</p>
							</li>

							<li className="flex gap-3 text-sm text-zinc-300 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
									3
								</span>
								<p className="leading-snug">
									<strong className="text-white block font-medium">Duis Aute Irure</strong>
									Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.
								</p>
							</li>

							<li className="flex gap-3 text-sm text-zinc-300 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
									4
								</span>
								<p className="leading-snug">
									<strong className="text-white block font-medium">Excepteur Sint Occaecat</strong>
									Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
								</p>
							</li>
						</ul>
					</div>

					{/* Bottom Callout / Footer Note */}
					<div className="pt-4 border-t border-zinc-800/60 mt-6">
						<div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300/90 flex items-center gap-2">
							<Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
							<span>Need help? Lorem ipsum dolor sit amet, consectetur adipiscing.</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
