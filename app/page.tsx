"use client";

import { ArrowRight, Shield, Zap, Lock, TrendingUp, Layers, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const protocols = [
  { name: "Zest",     description: "Bitcoin Capital Markets", color: "from-green-500 to-emerald-500" },
  { name: "Bitflow",  description: "sBTC/STX Liquidity",      color: "from-blue-500 to-cyan-500" },
  { name: "ALEX",     description: "DeFi Hub & DEX",          color: "from-purple-500 to-pink-500" },
  { name: "Stacking", description: "Native BTC Yield via PoX",color: "from-orange-400 to-amber-500" },
  { name: "Arkadiko", description: "Lending & USDA",          color: "from-red-500 to-orange-500" },
  { name: "Granite",  description: "Multi-collateral Lending", color: "from-gray-400 to-slate-500" },
];

const stats = [
  { value: "$545M+", label: "sBTC TVL on Stacks",  icon: TrendingUp },
  { value: "99%",    label: "Bitcoin sitting idle", icon: Lock },
  { value: "4+",     label: "DeFi Protocols",       icon: Layers },
  { value: "100%",   label: "Non-Custodial",         icon: Shield },
];

const features = [
  {
    title: "sBTC Payments",
    description: "Accept Bitcoin payments like Stripe — non-custodial, instant finality, real-time webhooks. Your customers pay in sBTC, funds go directly to your wallet.",
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/dashboard",
  },
  {
    title: "Dormant Vaults",
    description: "Deploy idle sBTC into Zest, Bitflow, ALEX, or Stacking automatically. Set your own exit conditions — minimum yield, max risk score, liquidation triggers — and your vault exits itself.",
    icon: Shield,
    color: "text-orange-600",
    bg: "bg-orange-50",
    href: "/dashboard/vaults",
  },
  {
    title: "Protocol Intelligence",
    description: "Live health monitoring across all major Stacks DeFi protocols. Real-time TVL, APY, risk scores, and utilization rates power your vault's autonomous decisions.",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
    href: "/dashboard/protocols",
  },
];

const vaultSteps = [
  { step: "1", title: "Choose a protocol", desc: "Zest, Bitflow, ALEX, or native Stacking" },
  { step: "2", title: "Set your conditions", desc: "Min yield %, max risk score, liquidation triggers" },
  { step: "3", title: "Deposit sBTC", desc: "Funds deploy non-custodially via Clarity contracts" },
  { step: "4", title: "Vault monitors itself", desc: "Exits automatically if any condition is breached" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <span className="font-semibold text-white">Lava</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/dashboard/protocols" className="hover:text-white transition-colors">Protocols</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                Get started
              </Button>
            </Link>
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-950 border-gray-800 text-white">
                <div className="flex flex-col gap-4 mt-8 text-sm">
                  <Link href="/docs" className="text-gray-400 hover:text-white">Docs</Link>
                  <Link href="/dashboard/protocols" className="text-gray-400 hover:text-white">Protocols</Link>
                  <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
                  <Link href="/roadmap" className="text-gray-400 hover:text-white">Roadmap</Link>
                  <Link href="/login" className="text-gray-400 hover:text-white">Sign in</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs px-3 py-1">
              Bitcoin capital in motion · Built on Stacks
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Bitcoin capital{" "}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                in motion
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Accept sBTC payments like Stripe. Deploy idle Bitcoin into DeFi automatically.
              Non-custodial, condition-based, Bitcoin-native.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-8">
                  Start building <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-900 px-8">
                  Read the docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Two products, one Bitcoin stack</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to accept and grow Bitcoin capital — without giving up custody.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors group"
              >
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{f.description}</p>
                <Link href={f.href} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How vaults work */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">Dormant Vaults</Badge>
            <h2 className="text-3xl font-bold mb-4">Your Bitcoin works while you sleep</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Over 99% of all Bitcoin sits idle. Dormant Vaults let you deploy sBTC into DeFi
              autonomously — and exit automatically when conditions you set are breached.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vaultSteps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-full">
                  <span className="text-3xl font-bold text-orange-500/30">{s.step}</span>
                  <h4 className="font-medium text-white text-sm mt-2 mb-1">{s.title}</h4>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
                {i < vaultSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-orange-500/40" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/dashboard/vaults">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-8">
                Create a vault <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Integrated with Stacks DeFi</h2>
            <p className="text-gray-400">Live protocol health monitoring across the full ecosystem.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {protocols.map(p => (
              <div key={p.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{p.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/dashboard/protocols" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 justify-center">
              View live protocol health <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-2xl p-10">
            <h2 className="text-3xl font-bold mb-4">Ready to activate your Bitcoin?</h2>
            <p className="text-gray-400 mb-8">Join merchants and Bitcoin holders putting sBTC to work on Stacks.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-8">
                  Get started free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-900 px-8">
                  Read the docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">₿</span>
            </div>
            <span className="text-white font-medium">Lava</span>
            <span className="text-gray-600">· Bitcoin capital in motion · Built on Stacks</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <div className="text-gray-600">· Risk rails for productive Bitcoin on Stacks</div>
  <a href="https://github.com/TheStacksAI" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
