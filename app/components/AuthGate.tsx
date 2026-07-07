"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogIn, X, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface AuthGateModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Dismiss callback */
  onDismiss: () => void;
  /** Optional human-readable action label, e.g. "like posts" */
  action?: string;
}

/**
 * AuthGateModal — a premium, branded sign-in prompt that overlays the
 * current page when a guest tries to use a feature that requires login.
 */
export default function AuthGateModal({
  show,
  onDismiss,
  action,
}: AuthGateModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Lock body scroll while modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [show]);

  // Close on Escape key
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [show, onDismiss]);

  if (!show) return null;

  const actionText = action ? `to ${action}` : "to use this feature";

  const handleSignIn = () => {
    onDismiss();
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in required"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onDismiss}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden
                    animate-[fadeIn_0.25s_ease,slideUp_0.3s_ease]"
      >
        {/* Decorative gradient header */}
        <div
          className="relative h-32 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #a1005b 0%, #d4246a 50%, #ff6b9d 100%)",
          }}
        >
          {/* Floating decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-6 w-16 h-16 border-2 border-white/40 rounded-full" />
            <div className="absolute top-8 right-8 w-10 h-10 border-2 border-white/30 rounded-full" />
            <div className="absolute bottom-4 left-1/2 w-24 h-24 border border-white/20 rounded-full -translate-x-1/2" />
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm
                       flex items-center justify-center text-white hover:bg-white/30
                       transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div
              className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-[#a1005b]/20
                          flex items-center justify-center"
            >
              <Sparkles size={28} className="text-[#a1005b]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-6 text-center">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
            Sign in to continue
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[280px] mx-auto">
            Create an account or sign in {actionText}. It&apos;s free and takes
            just a moment.
          </p>

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
                       text-white text-sm font-semibold tracking-wide
                       transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md"
            style={{
              background:
                "linear-gradient(135deg, #a1005b 0%, #d4246a 100%)",
              boxShadow: "0 8px 24px rgba(161, 0, 91, 0.3)",
            }}
          >
            <LogIn size={17} />
            Sign In / Create Account
          </button>

          {/* Continue browsing */}
          <button
            onClick={onDismiss}
            className="mt-3 w-full py-3 rounded-2xl text-sm font-medium
                       text-gray-500 hover:text-gray-700 hover:bg-gray-50
                       transition-all duration-200 border border-gray-200"
          >
            Continue Browsing
          </button>

          {/* Perks */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <ShoppingBag size={11} />
              Free to join
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Sparkles size={11} />
              Unlock all features
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
