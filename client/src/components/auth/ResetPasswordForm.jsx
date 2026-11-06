export default function ResetPasswordForm({ onBack }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <h2 className="font-semibold text-amber-100">Password reset is not available yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-50/80">Reefwatch does not currently have a configured password-reset email service or reset-token API. No reset email has been sent. Please contact your Reefwatch administrator for account help.</p>
      </div>
      <button type="button" onClick={onBack} className="w-full rounded-xl border border-teal-700/60 px-4 py-3 text-sm font-medium text-teal-200 transition hover:bg-teal-900/30">← Back to sign in</button>
    </div>
  );
}
