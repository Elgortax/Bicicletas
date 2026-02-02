"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      rut: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bikeNumber: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  const passwordChecklist = useMemo(
    () => [
      { label: "Mínimo 8 caracteres", met: passwordValue.length >= 8 },
      { label: "Incluye al menos una letra", met: /[A-Za-z]/.test(passwordValue) },
      { label: "Incluye al menos un número", met: /\d/.test(passwordValue) },
    ],
    [passwordValue],
  );

  const onSubmit = handleSubmit((values) => {
    setFormError(undefined);
    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        setFormError(payload.message ?? "No pudimos completar el registro.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    });
  });

  const handleGenerateNumber = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setValue("bikeNumber", String(random), { shouldDirty: true, shouldValidate: true });
  };

  const fullNameField = register("fullName");
  const usernameField = register("username");
  const emailField = register("email");
  const passwordField = register("password");
  const confirmPasswordField = register("confirmPassword");
  const bikeNumberField = register("bikeNumber");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
            Nombre y apellido
          </label>
          <Input id="fullName" placeholder="Andrea Soto" autoComplete="name" {...fullNameField} />
          <p className="text-xs text-slate-500">Solo letras y espacios (8 a 60 caracteres).</p>
          <FormError message={errors.fullName?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="rut" className="text-sm font-semibold text-slate-700">
            RUT
          </label>
          <Controller
            name="rut"
            control={control}
            render={({ field }) => (
              <Input
                id="rut"
                placeholder="12345678-9"
                autoComplete="off"
                maxLength={11}
                value={field.value ?? ""}
                onBlur={field.onBlur}
                ref={field.ref}
                onChange={(event) => field.onChange(formatRutInput(event.target.value))}
              />
            )}
          />
          <p className="text-xs text-slate-500">Sin puntos y con guion al final.</p>
          <FormError message={errors.rut?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm font-semibold text-slate-700">
            Nombre de usuario
          </label>
          <Input id="username" placeholder="asoto" autoComplete="username" {...usernameField} />
          <p className="text-xs text-slate-500">Entre 4 y 16 caracteres. Letras, números y ._-</p>
          <FormError message={errors.username?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Correo institucional
          </label>
          <Input id="email" type="email" placeholder="asoto@duoc.cl" autoComplete="email" {...emailField} />
          <FormError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Contraseña
          </label>
          <Input id="password" type="password" autoComplete="new-password" {...passwordField} />
          <ul className="text-xs text-slate-500">
            {passwordChecklist.map((item) => (
              <li key={item.label} className={item.met ? "text-emerald-600" : undefined}>
                {item.met ? "[x]" : "[ ]"} {item.label}
              </li>
            ))}
          </ul>
          <FormError message={errors.password?.message} />
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
            Confirmar contraseña
          </label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...confirmPasswordField} />
          <FormError message={errors.confirmPassword?.message} />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="bikeNumber" className="text-sm font-semibold text-slate-700">
          Número de bicicleta (4 dígitos)
        </label>
        <div className="flex gap-3">
          <Input
            id="bikeNumber"
            placeholder="1234"
            maxLength={4}
            inputMode="numeric"
            {...bikeNumberField}
          />
          <Button type="button" variant="secondary" onClick={handleGenerateNumber}>
            Generar
          </Button>
        </div>
        <FormError message={errors.bikeNumber?.message} />
      </div>

      <FormError message={formError} />
      <Button type="submit" className="w-full" isLoading={isPending} disabled={!isValid || isPending}>
        Crear cuenta
      </Button>
    </form>
  );
}

function formatRutInput(value: string) {
  return value.replace(/[^0-9kK-]/g, "").toUpperCase();
}
