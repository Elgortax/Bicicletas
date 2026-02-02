"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined);
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setFormError(payload.message ?? "No pudimos iniciar sesión.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="identifier" className="text-sm font-medium text-slate-700">
          Correo o RUT
        </label>
        <Input id="identifier" placeholder="tu-correo@duoc.cl" autoComplete="username" {...register("identifier")} />
        <FormError message={errors.identifier?.message} />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        <FormError message={errors.password?.message} />
      </div>
      <FormError message={formError} />
      <Button type="submit" className="w-full" isLoading={isPending}>
        Ingresar
      </Button>
    </form>
  );
}
