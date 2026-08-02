import Link from "next/link";
import { ArrowLeftIcon } from "@/components/SvgIcons";

export default function SportNotFound() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-display-md font-bold text-neutral-900 font-display mb-2">
          Sport not found
        </h1>
        <p className="text-body-sm text-neutral-500 mb-8">
          The sport you are looking for does not exist or is not available yet.
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
