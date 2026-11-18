import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Users,
  Sparkles,
  Download,
  Mail,
} from 'lucide-react';
import { RSVPSubmission, WeddingConfig } from '../../types/wedding';

interface RsvpSectionProps {
  config: WeddingConfig;
}

const STORAGE_KEY = 'melcome_blue_door_rsvps_v1';

export const RsvpSection: React.FC<RsvpSectionProps> = ({ config }) => {
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [attending, setAttending] = useState<'yes' | 'no' | 'joyfully-online'>(
    'yes'
  );
  const [eventsAttending, setEventsAttending] = useState<string[]>([
    'Mehndi Ceremony',
    'Wedding Ceremony',
    'Starlight Reception',
  ]);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestSubmission, setLatestSubmission] =
    useState<RSVPSubmission | null>(null);
  const [savedRsvps, setSavedRsvps] = useState<RSVPSubmission[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedRsvps(JSON.parse(raw));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleEventSelection = (evName: string) => {
    setEventsAttending((prev) =>
      prev.includes(evName)
        ? prev.filter((item) => item !== evName)
        : [...prev, evName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);

    const record: RSVPSubmission = {
      id: `MLC-${Math.floor(100000 + Math.random() * 900000)}`,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      guestsCount,
      attending,
      eventsAttending,
      dietaryNotes: dietaryNotes.trim(),
      songRequest: songRequest.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // If user configured a live webhook / Formspree URL in Personalize Modal or env, POST to it
    const webhook =
      config.rsvpWebhookUrl ||
      (import.meta.env.VITE_RSVP_WEBHOOK_URL as string | undefined);

    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            wedding: `${config.brideName} & ${config.groomName}`,
            ...record,
          }),
        });
      } catch {
        // Fallback gracefully to local storage even if offline
      }
    } else {
      await new Promise((r) => setTimeout(r, 650));
    }

    const updated = [record, ...savedRsvps];
    setSavedRsvps(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setLatestSubmission(record);
    setIsSubmitting(false);
  };

  const handleDownloadBoardingPass = (sub: RSVPSubmission) => {
    const content = [
      '============================================================',
      `   ${config.brandTitle} — VILLA SANCTUARY PASS`,
      '============================================================',
      `COUPLE:         ${config.brideName} & ${config.groomName}`,
      `DESTINATION:    ${config.destinationName}`,
      `DATES:          ${config.weddingDateDisplay}`,
      `PASS CODE:      ${sub.id}`,
      '------------------------------------------------------------',
      `GUEST NAME:     ${sub.guestName}`,
      `PARTY SIZE:     ${sub.guestsCount} Guest(s)`,
      `ATTENDANCE:     ${
        sub.attending === 'yes'
          ? 'Joyfully Accepts'
          : sub.attending === 'joyfully-online'
          ? 'Celebrating From Afar'
          : 'Regretfully Declines'
      }`,
      `EVENTS:         ${sub.eventsAttending.join(', ') || 'None'}`,
      `MESSAGE:        ${sub.message || 'With love & blessings!'}`,
      '============================================================',
      '“Some beautiful moments deserve a beautiful beginning.”',
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Melcome-Blue-Door-Pass-${sub.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="section-rsvp"
      className="relative py-28 md:py-36 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.9 }}
          className="rounded-[2.5rem] bg-[#071624]/85 backdrop-blur-2xl border border-[#dab87b]/40 p-8 md:p-14 shadow-[0_35px_100px_rgba(0,0,0,0.75)] relative overflow-hidden"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-[#2d8ec8]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-[#dab87b]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#dab87b]/35 text-[10px] uppercase tracking-[0.34em] text-[#dab87b] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter VIII • RSVP Concierge</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white mb-3">
              Reserve Your Place{' '}
              <span className="italic text-[#f2e6cd]">Beyond The Blue Door</span>
            </h2>
            <p className="text-xs md:text-sm text-white/75">
              Kindly confirm your attendance by January 10, 2027 so our villa concierge can prepare your coastal suite and celebration welcome.
            </p>
          </div>

          {latestSubmission ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 rounded-3xl bg-gradient-to-br from-[#0e2d45] to-[#081b2b] border border-[#dab87b]/55 p-8 text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-full bg-[#dab87b]/20 border border-[#dab87b] flex items-center justify-center mx-auto text-[#dab87b]">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.34em] text-[#dab87b] mb-1">
                  Villa Sanctuary Pass • {latestSubmission.id}
                </div>
                <h3 className="font-serif text-3xl text-white">
                  Thank You, {latestSubmission.guestName}
                </h3>
                <p className="text-xs text-white/75 mt-1">
                  Your RSVP for {latestSubmission.guestsCount} guest(s) has been registered with{' '}
                  {config.brideName} &amp; {config.groomName}’s destination concierge.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto p-4 rounded-2xl bg-black/25 border border-white/10 text-xs">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Status
                  </div>
                  <div className="text-[#8cc9ea] font-medium mt-0.5">
                    {latestSubmission.attending === 'yes'
                      ? 'Joyfully Attending'
                      : latestSubmission.attending === 'joyfully-online'
                      ? 'Joining Virtually'
                      : 'Sending Warm Wishes'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Party Size
                  </div>
                  <div className="text-white font-medium mt-0.5">
                    {latestSubmission.guestsCount} Guest(s)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Events
                  </div>
                  <div className="text-[#f2e6cd] font-medium mt-0.5 truncate">
                    {latestSubmission.eventsAttending.length} Selected
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadBoardingPass(latestSubmission)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#dab87b] text-[#071624] font-semibold text-xs uppercase tracking-[0.22em] hover:bg-[#e7d2a7] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Villa Boarding Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLatestSubmission(null)}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-xs uppercase tracking-[0.2em] text-white"
                >
                  Submit Another RSVP
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {/* Row 1: Guest Name & Number of Guests */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7">
                  <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Aria & Julian Vance"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b] transition-colors"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2">
                    Number of Guests *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 py-3.5 rounded-2xl text-xs font-medium border transition-all ${
                          guestsCount === num
                            ? 'bg-[#2d8ec8] text-white border-[#8cc9ea] shadow-[0_0_20px_rgba(45,142,200,0.45)]'
                            : 'bg-white/[0.04] hover:bg-white/10 text-white/75 border-white/15'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Contact Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.26em] text-white/65 mb-2">
                    Email Address (For Villa Keycard &amp; Itinerary)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="guest@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.26em] text-white/65 mb-2">
                    Dietary Preferences / Suite Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Vegetarian, Gluten-free, Seaplane arrival"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b]"
                  />
                </div>
              </div>

              {/* Row 3: Attendance Confirmation */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-[#dab87b] mb-2.5">
                  Attendance Confirmation *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'yes',
                      title: 'Joyfully Accepts',
                      sub: 'See you Beyond The Blue Door',
                    },
                    {
                      id: 'no',
                      title: 'Regretfully Declines',
                      sub: 'Sending love & blessings',
                    },
                    {
                      id: 'joyfully-online',
                      title: 'Joining Virtually',
                      sub: 'Request live sunset stream',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setAttending(
                          opt.id as 'yes' | 'no' | 'joyfully-online'
                        )
                      }
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        attending === opt.id
                          ? 'bg-gradient-to-br from-[#184d73] to-[#123854] border-[#dab87b] shadow-[0_0_25px_rgba(218,184,123,0.3)]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15'
                      }`}
                    >
                      <div className="text-xs font-medium text-white">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-white/60 mt-0.5">
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Celebrations Attending */}
              {attending === 'yes' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.26em] text-white/65 mb-2.5">
                    Celebrations You Will Attend
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      'Mehndi Ceremony',
                      'Wedding Ceremony',
                      'Starlight Reception',
                    ].map((evName) => {
                      const active = eventsAttending.includes(evName);
                      return (
                        <button
                          key={evName}
                          type="button"
                          onClick={() => toggleEventSelection(evName)}
                          className={`px-4 py-2 rounded-full text-xs border transition-all ${
                            active
                              ? 'bg-[#dab87b]/20 text-[#f2e6cd] border-[#dab87b]'
                              : 'bg-white/5 text-white/60 border-white/15'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {evName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Row 5: Optional Message for the Couple */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.26em] text-white/65 mb-2">
                  Optional Message or Blessing for {config.brideName} &amp;{' '}
                  {config.groomName}
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a memory, a toast, or a song you want to dance to under the palms..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#dab87b] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Users className="w-4 h-4 text-[#8cc9ea]" />
                  <span>
                    {savedRsvps.length > 0
                      ? `${savedRsvps.length} family & guest RSVP(s) confirmed on this device`
                      : 'Instant digital Villa Pass issued upon confirmation'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#184d73] via-[#246d9e] to-[#184d73] border border-[#dab87b]/70 text-xs uppercase tracking-[0.28em] text-white font-display shadow-[0_0_40px_rgba(45,142,200,0.45)] hover:shadow-[0_0_55px_rgba(218,184,123,0.65)] hover:scale-[1.02] transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#dab87b]" />
                  <span>
                    {isSubmitting ? 'Confirming Reservation...' : 'Confirm Attendance'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
