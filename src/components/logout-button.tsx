"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <Button type="button" variant="ghost" onClick={handleLogout} isLoading={isPending}>
      Cerrar sesión
    </Button>
  );
}
