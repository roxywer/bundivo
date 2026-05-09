import Link from 'next/link'
import Image from 'next/image'
import { Music2, ArrowRight, Heart, Shield, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
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

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30">
          <Music2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-black mb-5">
          Music for every<br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Kenyan pocket</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Bundivo was built on a simple belief: premium music streaming shouldn't cost most Kenyans an entire day's wage. We make it possible to enjoy Spotify Premium for under KES 200 a month.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl overflow-hidden aspect-[16/6] shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=450&fit=crop"
            alt="Music concert"
            width={1200}
            height={450}
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 space-y-8">
        <div>
          <h2 className="text-3xl font-black mb-4">Our Story</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            Bundivo started in Nairobi in 2024 when a group of music lovers realized they were all paying individually for subscriptions they could split. Spotify Family costs KES 1,099/month — but split between 6 friends, that's just KES 183 each.
          </p>
          <p className="text-gray-400 leading-relaxed text-lg mt-4">
            The problem? There was no safe, structured way to do it. People were sharing passwords, losing access, and dealing with constant payment headaches. We built Bundivo to solve that — a platform that manages everything securely, with M-Pesa as the payment backbone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { icon: Heart, title: 'Built for Kenya', desc: 'M-Pesa first. Phone number login. No credit cards required. Designed for how Kenyans actually pay.', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Shield, title: 'Secure by design', desc: 'We manage all subscription accounts. Users never see master credentials or share passwords.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Zap, title: 'Instant & automated', desc: 'Once a group is fully funded, Spotify invites go out automatically. No manual steps needed.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { icon: Globe, title: 'Transparent pricing', desc: 'Zero platform fees. You pay exactly your share of the subscription — nothing more, ever.', color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((v) => (
            <div key={v.title} className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                <v.icon className={`w-5 h-5 ${v.color}`} />
              </div>
              <h3 className="text-white font-bold mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to start saving?</h2>
          <p className="text-gray-400 mb-8">Join thousands of Kenyans already enjoying Spotify Premium for under KES 200.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-green-500/25 transition">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-gray-600 text-sm">Bundivo © {new Date().getFullYear()} · Made with ❤️ in Nairobi</span>
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition">← Back to home</Link>
        </div>
      </footer>
    </div>
  )
}
