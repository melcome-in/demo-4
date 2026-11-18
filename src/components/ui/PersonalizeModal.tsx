import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface PersonalizeModalProps {
  isOpen: boolean;
  config: WeddingConfig;
  onClose: () => void;
  onSave: (updated: WeddingConfig) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<WeddingConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#081a2a] border border-[#dab87b]/40 p-6 md:p-8 text-[#fcfaf5] shadow-[0_25px_90px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/75"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#dab87b]/30 text-[10px] uppercase tracking-[0.28em] text-[#dab87b] mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Melcome Studio Bespoke Customizer</span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
          Personalize Wedding Invitation
        </h3>
        <p className="text-xs text-white/65 mb-6">
          Customize the Bride &amp; Groom names, wedding countdown date, destination venue, or RSVP webhook endpoint live across the entire 3D experience.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                brideName: 'Aanya',
                groomName: 'Kabir',
              })
            }
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-[#8cc9ea]"
          >
            Preset: Aanya &amp; Kabir
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                brideName: 'Sophia',
                groomName: 'Alexander',
              })
            }
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-[#8cc9ea]"
          >
            Preset: Sophia &amp; Alexander
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                brideName: '[BRIDE NAME]',
                groomName: '[GROOM NAME]',
              })
            }
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-[#dab87b]/30 text-[11px] text-[#dab87b]"
          >
            Template Placeholders
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1.5">
                Bride Name
              </label>
              <input
                type="text"
                value={form.brideName}
                onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#dab87b]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1.5">
                Groom Name
              </label>
              <input
                type="text"
                value={form.groomName}
                onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#dab87b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1.5">
              Destination Sanctuary Name
            </label>
            <input
              type="text"
              value={form.destinationName}
              onChange={(e) =>
                setForm({ ...form, destinationName: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#dab87b]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1.5">
              Optional RSVP Webhook / Formspree Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://formspree.io/f/your-id (optional)"
              value={form.rsvpWebhookUrl}
              onChange={(e) =>
                setForm({ ...form, rsvpWebhookUrl: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#dab87b]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs uppercase tracking-[0.2em] text-white/75"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1e71aa] to-[#2d8ec8] border border-[#dab87b]/50 text-xs uppercase tracking-[0.22em] text-white font-medium shadow-lg"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Live</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
