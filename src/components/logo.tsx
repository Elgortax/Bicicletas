import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "default" | "sm";
};

export function Brand({ size = "default" }: Props) {
  const dimensions = size === "default" ? 56 : 40;
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-lg border border-transparent px-1 py-0.5 text-left text-slate-900 transition hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
    >
      <Image
        src="/duocuc.png"
        alt="Bicicletas DUOC UC"
        width={dimensions}
        height={dimensions}
        className="rounded-md border border-slate-200 bg-white object-contain"
        priority
      />
      <span className="text-base font-semibold leading-tight">
        Bicicletas
        <span className="block text-xs font-medium text-slate-500">Duoc UC Campus</span>
      </span>
    </Link>
  );
}
