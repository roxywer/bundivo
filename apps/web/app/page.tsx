import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Music2, Users, CreditCard, Shield, Zap, CheckCircle2, Star, ChevronRight, Headphones, TrendingDown, Globe } from 'lucide-react'

const stats = [
  { value: '5,000+', label: 'Active Users' },
  { value: 'KES 150', label: 'Per Month' },
  { value: '4x', label: 'Cost Savings' },
  { value: '< 2 min', label: 'Setup Time' },
]

const features = [
  {
    icon: Users,
    title: 'Group Sharing',
    desc: 'Split Spotify Family with up to 6 people. Everyone gets their own account — no sharing passwords.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: CreditCard,
    title: 'M-Pesa Payments',
    desc: 'Pay instantly via Safaricom M-Pesa STK Push. Just enter your PIN — done in seconds.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Zap,
    title: 'Instant Activation',
    desc: 'Once your group is fully funded, Spotify invites go out automatically. No waiting.',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Fully Managed',
    desc: 'We handle the subscription accounts. You just enjoy the music — completely hands-off.',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-500/10',
  },
]

const testimonials = [
  {
    name: 'Amina Odhiambo',
    role: 'Nairobi, Student',
    text: 'I pay KES 150 a month instead of KES 669. Bundivo is a total game changer for me!',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face',
    stars: 5,
  },
  {
    name: 'Brian Muthomi',
    role: 'Mombasa, Developer',
    text: 'Set up in 2 minutes. The M-Pesa integration is seamless — STK Push worked first try.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    stars: 5,
  },
  {
    name: 'Cynthia Wambui',
    role: 'Kisumu, Designer',
    text: 'Love that I get a proper Spotify Family account. Same quality, fraction of the price.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    stars: 5,
  },
]

const plans = [
  { name: 'Spotify Family', full: 'KES 669', split: 'KES 150', members: 6, color: 'from-green-500 to-emerald-600', popular: true },
  { name: 'Apple Music Family', full: 'KES 599', split: 'KES 150', members: 6, color: 'from-red-500 to-pink-600', popular: false },
  { name: 'Canva Pro', full: 'KES 1,200', split: 'KES 300', members: 5, color: 'from-blue-500 to-purple-600', popular: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c10] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="border-b border-white/5 bg-[#080c10]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Bundivo</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-400 hover:text-white text-sm font-medium transition px-3 py-2">Sign in</Link>
            <Link href="/login" className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/25 hover:opacity-90 transition">
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-green-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/6 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Kenya&apos;s #1 Shared Subscription Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              Premium Spotify<br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                for KES 150/mo
              </span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              Join a Spotify Family group with others in Kenya, pay your share via M-Pesa, and enjoy premium music. No cards. No hassle. Just great music.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/login" className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-green-500/30 transition text-base">
                Start saving today <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition text-base">
                See how it works
              </a>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['photo-1531123897727-8f129e1688ce', 'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330'].map((id, i) => (
                  <Image key={i} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`} alt="user" width={36} height={36}
                    className="w-9 h-9 rounded-full border-2 border-[#080c10] object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-400 text-xs">Loved by 5,000+ Kenyans</p>
              </div>
            </div>
          </div>

          {/* Right — App mockup */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-[320px]">
              {/* Phone frame */}
              <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
                <div className="bg-[#0d1117] rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-500">
                    <span>9:41</span>
                    <div className="w-20 h-4 bg-gray-800 rounded-full mx-auto" />
                    <span>100%</span>
                  </div>
                  {/* App content */}
                  <div className="px-5 pb-8">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-gray-400 text-xs">Welcome back</p>
                        <p className="text-white font-bold text-lg">Amina 👋</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                    </div>

                    {/* Stat card */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 mb-4 shadow-lg shadow-green-500/30">
                      <p className="text-green-100 text-xs mb-1">Your monthly saving</p>
                      <p className="text-white font-black text-3xl">KES 919</p>
                      <p className="text-green-200 text-xs mt-1">vs. individual plan</p>
                    </div>

                    {/* Group card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Headphones className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">Nairobi Vibes</p>
                          <p className="text-gray-500 text-xs">Spotify Family · 5/6 members</p>
                        </div>
                        <div className="ml-auto">
                          <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full w-5/6" />
                      </div>
                    </div>

                    {/* Payment row */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">M-Pesa paid</p>
                        <p className="text-gray-500 text-xs">KES 180 · Just now</p>
                      </div>
                      <p className="ml-auto text-green-400 font-bold text-sm">✓</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-16 top-16 bg-gray-900 border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm">
                <p className="text-gray-400 text-xs mb-0.5">You save</p>
                <p className="text-green-400 font-black text-xl">83%</p>
              </div>
              <div className="absolute -right-12 bottom-24 bg-gray-900 border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Lower cost</p>
                    <p className="text-gray-500 text-xs">Every month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center hover:bg-white/5 transition">
                <p className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO BAND */}
      <section className="py-2 overflow-hidden border-y border-white/5">
        <div className="flex gap-4 w-max animate-scroll">
          {[
            'photo-1511671782779-c97d3d27a1d4',
            'photo-1493225457124-a3eb161ffa5f',
            'photo-1514320291840-2e0a9bf2a9ae',
            'photo-1470225620780-dba8ba36b745',
            'photo-1506157786151-b8491531f063',
            'photo-1571330735066-03aaa9429d89',
            'photo-1511671782779-c97d3d27a1d4',
            'photo-1493225457124-a3eb161ffa5f',
            'photo-1514320291840-2e0a9bf2a9ae',
            'photo-1470225620780-dba8ba36b745',
          ].map((id, i) => (
            <div key={i} className="w-52 h-36 rounded-2xl overflow-hidden shrink-0 opacity-60 hover:opacity-100 transition">
              <Image src={`https://images.unsplash.com/${id}?w=400&h=280&fit=crop`} alt="music" width={208} height={144} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Globe className="w-3.5 h-3.5" /> Built for Kenya
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">to save on music</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">No complicated setup. No hidden fees. Just affordable music for everyone.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i} className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 rounded-3xl p-8 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className="w-6 h-6 text-white/90" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-gradient-to-b from-transparent via-green-500/3 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Up and running in<br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">under 2 minutes</span>
            </h2>
            <p className="text-gray-400 text-lg">Simple steps, massive savings.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {[
                { n: '01', title: 'Create your account', desc: 'Sign up with your Kenyan phone number. Verify with a quick OTP — no email needed.', icon: '📱' },
                { n: '02', title: 'Create or join a group', desc: 'Start a new Spotify group or join one instantly using an invite link from a friend.', icon: '👥' },
                { n: '03', title: 'Pay via M-Pesa', desc: 'You\'ll get an STK Push on your Safaricom line. Enter your PIN and you\'re done.', icon: '💳' },
                { n: '04', title: 'Enjoy Spotify Premium', desc: 'Receive your Spotify Family invite and start streaming. Cancel anytime.', icon: '🎵' },
              ].map((s, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-green-500/25 shrink-0">
                      {s.n}
                    </div>
                    {i < 3 && <div className="w-px flex-1 mt-3 bg-gradient-to-b from-green-500/30 to-transparent min-h-[2rem]" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-white font-bold text-lg mb-1">{s.icon} {s.title}</p>
                    <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Side photo */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=750&fit=crop"
                  alt="Music streaming"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c10] via-transparent to-transparent" />
              </div>
              {/* Overlay card */}
              <div className="absolute bottom-8 left-8 right-8 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-semibold">Nairobi Night Owls</p>
                  <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gray-800 text-gray-500 border border-dashed border-gray-600'}`}>
                      {i < 5 ? String.fromCharCode(65 + i) : '+'}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">5/6 members · KES 900 raised</span>
                  <span className="text-green-400 font-semibold">83%</span>
                </div>
                <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full" style={{ width: '83%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Transparent pricing.<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">No surprises.</span>
          </h2>
          <p className="text-gray-400 text-lg">Pay only your fair share — every month via M-Pesa.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`relative rounded-3xl border p-8 ${p.popular ? 'bg-gradient-to-b from-green-500/10 to-emerald-600/5 border-green-500/30' : 'bg-white/3 border-white/10'}`}>
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-green-500/30">Most Popular</span>
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-2">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-6">Split between {p.members} members</p>

              <div className="flex items-end gap-3 mb-6">
                <div>
                  <p className="text-gray-600 text-sm line-through">{p.full}/mo</p>
                  <p className={`text-5xl font-black bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{p.split}</p>
                  <p className="text-gray-400 text-sm mt-1">per person / month</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {['Full Spotify Premium access', 'Individual account', 'M-Pesa payments', 'Cancel anytime'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/login" className={`flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl transition w-full ${p.popular ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:opacity-90' : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'}`}>
                Get started <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-transparent via-white/2 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Kenyans love<br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Bundivo</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/8 hover:border-white/15 rounded-3xl p-7 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/15 via-emerald-600/10 to-teal-600/5 border border-green-500/20 p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-50%] left-[30%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="absolute top-6 right-8 text-5xl opacity-20 select-none">🎵</div>
          <div className="absolute bottom-6 left-8 text-4xl opacity-20 select-none">🎧</div>

          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Start listening today<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">for less than KES 200</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of Kenyans already enjoying Spotify Premium through Bundivo. Setup takes 2 minutes.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-green-500/30 transition text-lg">
            Create free account <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-600 text-sm mt-5">M-Pesa only · No hidden fees · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Bundivo</span>
            <span className="text-gray-600 text-sm">&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-gray-600 text-sm">Made with ❤️ for Kenya</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-300 transition">Login</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
