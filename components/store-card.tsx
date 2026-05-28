// components/store-card.tsx
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  emoji: string;
  activeCount: number;
};

export function StoreCard({ id, name, emoji, activeCount }: Props) {
  return (
    <Link
      href={`/store/${id}`}
      className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-sm active:scale-95 transition-transform"
    >
      <span className="text-4xl mb-2">{emoji}</span>
      <span className="text-sm font-semibold text-gray-800 text-center">{name}</span>
      {activeCount > 0 ? (
        <span className="mt-2 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
          {activeCount}
        </span>
      ) : (
        <span className="mt-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-400">
          all clear
        </span>
      )}
    </Link>
  );
}
