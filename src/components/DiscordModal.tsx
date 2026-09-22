import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink } from 'lucide-react';
import { DISCORD_INVITE_URL, DISCORD_INVITE_CODE } from '../data/constants';

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscordModal: React.FC<DiscordModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const inviteCode = DISCORD_INVITE_CODE;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCORD_INVITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="discord-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="discord-modal-card"
        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="discord-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Discord Header Banner */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Flux Community Discord</h3>
            <p className="text-xs text-zinc-400">Official Community & Support Server</p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Join our Discord community to connect with other developers, receive release announcements, get support, and collaborate on projects.
        </p>

        {/* Invite link box */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black border border-white/10 mb-5">
          <span className="text-xs font-mono text-zinc-300 flex-1 truncate px-2">
            https://{inviteCode}
          </span>
          <button
            id="discord-copy-link-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            id="discord-accept-invite-btn"
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 shadow-sm"
          >
            <span>Accept Invite & Join</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            id="discord-modal-cancel-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
