'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Music2, Users, ArrowLeft, Loader2, Check, Headphones, Bot, UserCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const CATEGORIES = [
  { id: 'music', name: 'Music Streaming', icon: Music2 },
  { id: 'ai', name: 'AI Tools', icon: Bot },
  { id: 'personal', name: 'Personal Group', icon: UserCircle },
]

const PLANS = [
  { type: 'Spotify Family', category: 'music', slots: 6, price: 150, total: 900, icon: Music2, color: 'text-green-400', bg: 'bg-green-500/20' },
  { type: 'Apple Music Family', category: 'music', slots: 6, price: 470, total: 470, icon: Headphones, color: 'text-red-400', bg: 'bg-red-500/20' },
  { type: 'ChatGPT Business', category: 'ai', slots: 6, price: 600, total: 3600, icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { type: 'Personal Group', category: 'personal', slots: 6, price: 0, total: 0, icon: UserCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', customizable: true },
]

export default function CreateGroupPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [customPrice, setCustomPrice] = useState(100)
  const [customSlots, setCustomSlots] = useState(6)

  const filteredPlans = selectedCategory 
    ? PLANS.filter(p => p.category === selectedCategory)
    : PLANS
  
  const plan = filteredPlans[selected] || filteredPlans[0]

  const handleCreate = async () => {
    if (!name.trim()) { setError('Group name is required'); return }
    setError('')
    setLoading(true)
    try {
      const isPersonal = plan.type === 'Personal Group'
      const finalPrice = isPersonal ? customPrice : plan.price
      const finalSlots = isPersonal ? customSlots : plan.slots
      const finalTotal = finalPrice * finalSlots
      
      const group = await api.post<{ id: string }>('/groups', {
        name: name.trim(),
        subscriptionType: plan.type,
        maxMembers: finalSlots,
        targetAmount: finalTotal,
      })
      router.push(`/groups/${group.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create a Group</h1>
          <p className="text-gray-400 text-sm">Choose a plan and invite members</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Family Spotify Plan"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Category</label>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setSelectedCategory(null); setSelected(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedCategory === null ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelected(0); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                  selectedCategory === cat.id ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <cat.icon className="w-4 h-4" /> {cat.name}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium text-gray-300 mb-3">Select Plan</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPlans.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(i)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    selected === i ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  {selected === i && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${p.color}`} />
                    </div>
                    <span className="text-white font-semibold text-sm">{p.type}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Users className="w-3.5 h-3.5" /> {p.slots} member slots
                    </div>
                    <p className="text-green-400 font-bold">{formatCurrency(p.price)}<span className="text-gray-500 font-normal text-xs"> /person/mo</span></p>
                    {!p.customizable && <p className="text-gray-500 text-xs">Total: {formatCurrency(p.total)}</p>}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {plan.customizable && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Custom Group Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price per person (KES)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  min={1}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Number of members</label>
                <input
                  type="number"
                  value={customSlots}
                  onChange={(e) => setCustomSlots(Number(e.target.value))}
                  min={2}
                  max={20}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-white font-semibold text-sm mb-2">Summary</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-400"><span>Plan</span><span className="text-white">{plan.type}</span></div>
            <div className="flex justify-between text-gray-400"><span>Max members</span><span className="text-white">{plan.customizable ? customSlots : plan.slots}</span></div>
            <div className="flex justify-between text-gray-400"><span>Per member</span><span className="text-white">{formatCurrency(plan.customizable ? customPrice : plan.price)}/mo</span></div>
            <div className="flex justify-between text-gray-400 border-t border-gray-700 pt-1.5 mt-1.5"><span>Target amount</span><span className="text-green-400 font-bold">{formatCurrency(plan.customizable ? customPrice * customSlots : plan.total)}</span></div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={handleCreate}
          disabled={loading || !name.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/25"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Group'}
        </motion.button>
      </div>
    </div>
  )
}
