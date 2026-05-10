import Link from 'next/link'
import { Music2, CheckCircle2, ArrowRight, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Spotify Duo',
    desc: 'Perfect for 2 people',
    full: 'KES 549',
    split: 'KES 150',
    perMonth: 150,
    members: 2,
    color: 'from-blue-500 to-cyan-600',
    features: ['2 Premium accounts', 'Ad-free music', 'Offline downloads', 'On-demand playback'],
    popular: false,
  },
  {
    name: 'Spotify Family',
    desc: 'Best value — up to 6 people',
    full: 'KES 669',
    split: 'KES 150',
    perMonth: 150,
    members: 6,
    color: 'from-green-500 to-emerald-600',
    features: ['6 Premium accounts', 'Ad-free music', 'Offline downloads', 'On-demand playback', 'Individual account per member'],
    popular: true,
  },
]

const faqs = [
  { q: 'How does group sharing work?', a: 'You join a group with other users. Each person gets their own Spotify Premium account under the same Family plan. You pay only your share via M-Pesa.' },
  { q: 'When does my subscription activate?', a: 'Once all members in a group have paid, the group gets funded and Spotify Family invite links are sent out automatically.' },
  { q: 'What happens if someone doesn\'t pay?', a: 'Members who fail to pay lose their reserved slot. The slot opens up for someone else to join and pay.' },
  { q: 'Can I cancel anytime?', a: 'Yes. You can leave a group before it\'s fully funded. Once active, you\'ll complete the current billing cycle.' },
  { q: 'Is my M-Pesa payment secure?', a: 'Yes. All payments are processed directly through Safaricom Daraja API. Bundivo never stores your M-Pesa PIN.' },
  { q: 'What if the STK Push fails?', a: 'You can retry the M-Pesa payment from your group page. Failed attempts don\'t charge your account.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080c10] text-white">
      <nav className="border-b border-white/5 bg-[#080c10]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Bundivo</span>
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" /> Simple pricing, no surprises
        </div>
        <h1 className="text-5xl font-black mb-4">Pay your fair share.<br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Nothing more.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Split the cost of Spotify with others in Kenya. Pay monthly via M-Pesa — no credit cards needed.</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl border p-8 ${p.popular ? 'bg-gradient-to-b from-green-500/10 to-emerald-600/5 border-green-500/30' : 'bg-white/3 border-white/10'}`}>
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-green-500/30">Most Popular</span>
                </div>
              )}
              <h2 className="text-white font-bold text-xl mb-1">{p.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{p.desc} · {p.members} members</p>
              <p className="text-gray-600 text-sm line-through mb-1">{p.full}/mo full price</p>
              <p className={`text-5xl font-black bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{p.split}</p>
              <p className="text-gray-400 text-sm mt-1 mb-7">per person / month via M-Pesa</p>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl transition w-full ${p.popular ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:opacity-90' : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'}`}>
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">Bundivo charges no platform fee. You pay only the subscription split.</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-black text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">{f.q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-gray-600 text-sm">Bundivo © {new Date().getFullYear()}</span>
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition">← Back to home</Link>
        </div>
      </footer>
    </div>
  )
}
