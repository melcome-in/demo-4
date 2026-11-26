import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { RSVPSubmission, WeddingConfig } from '../../types/wedding';

interface RsvpSectionProps {
  config: WeddingConfig;
}

const STORAGE_KEY = 'melcome_blue_door_rsvps_v1';

export const RsvpSection: React.FC<RsvpSectionProps> = ({ config }) => {
  const [guestName, setGuestName] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsSubmitting(true);

    const record: RSVPSubmission = {
      id: `MLC-${Math.floor(100000 + Math.random() * 900000)}`,
      guestName: guestName.trim(),
      email: '',
      phone: '',
      guestsCount,
      attending,
      eventsAttending: [],
      dietaryNotes: '',
      songRequest: '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
    } catch {
      // ignore storage errors
    }

    await new Promise((r) => setTimeout(r, 400));
    setSubmittedName(record.guestName);
    setIsSubmitting(false);
  };

  return (
    <section
      id="section-rsvp"
      className="relative py-24 md:py-32 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2.2rem] bg-[#071624]/82 backdrop-blur-2xl border border-[#dab87b]/40 p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        >
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white mb-2">
              RSVP
            </h2>
            <p className="text-xs md:text-sm text-white/75">
              Please confirm your attendance for {config.brideName} &amp;{' '}
              {config.groomName}’s wedding.
            </p>
          </div>

          {submittedName ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#dab87b] mx-auto" />
              <h3 className="font-serif text-3xl text-white">
                Thank You, {submittedName}
              </h3>
              <p className="text-sm text-white/75">
                Your response has been received. We look forward to celebrating with you.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedName(null);
                  setGuestName('');
                  setMessage('');
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs uppercase tracking-[0.2em] text-white"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestsCount(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        guestsCount === num
                          ? 'bg-[#2d8ec8] text-white border-[#8cc9ea]'
                          : 'bg-white/[0.05] hover:bg-white/10 text-white/75 border-white/15'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2">
                  Attendance Confirmation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-3 rounded-xl border text-xs uppercase tracking-[0.18em] transition-all ${
                      attending === 'yes'
                        ? 'bg-[#184d73] border-[#dab87b] text-white'
                        : 'bg-white/[0.05] border-white/15 text-white/70'
                    }`}
                  >
                    Joyfully Accepts
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-3 rounded-xl border text-xs uppercase tracking-[0.18em] transition-all ${
                      attending === 'no'
                        ? 'bg-[#184d73] border-[#dab87b] text-white'
                        : 'bg-white/[0.05] border-white/15 text-white/70'
                    }`}
                  >
                    Regretfully Declines
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-white/65 mb-2">
                  Optional Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a warm note for the couple..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#184d73] via-[#246d9e] to-[#184d73] border border-[#dab87b]/70 text-xs uppercase tracking-[0.28em] text-white font-display hover:scale-[1.01] transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#dab87b]" />
                <span>{isSubmitting ? 'Sending...' : 'Confirm Attendance'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
