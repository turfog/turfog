import Link from "next/link";
import { ArrowLeftIcon, UserIcon } from "@/components/SvgIcons";

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-200 rounded-full mb-4">
          <UserIcon size={28} className="text-neutral-400" />
        </div>
        <h1 className="text-display-sm font-bold text-neutral-900 font-display mb-2">
          Player not found
        </h1>
        <p className="text-body-sm text-neutral-500 mb-8">
          This profile does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-green text-white text-body-sm font-semibold rounded-xl hover:bg-primary-green/90 transition-colors"
        >
          <ArrowLeftIcon size={18} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
