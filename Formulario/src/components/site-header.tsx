"use client";

import Link from "next/link";
import { Brand } from "./logo";
import { LogoutButton } from "./logout-button";

type Props = {
  user: { id: string; fullName: string } | null;
};

export function SiteHeader({ user }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Brand size="sm" />
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/#features" className="hover:text-slate-900">
            Detalles
          </Link>
          <Link href="/#pasos" className="hover:text-slate-900">
            Pasos
          </Link>
        </nav>
        {user ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Link href="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 hover:text-slate-900">
              Mi panel
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Ingresar
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center rounded-full bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Registrarme
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
