"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  type DebtorWriteOffInput,
  DebtorWriteOffSchema,
} from "@/schemas/debtor-schema";

type WriteOffDebtorFormProps = {
  onWriteOff: (payload: DebtorWriteOffInput) => Promise<void>;
};

export function WriteOffDebtorForm({ onWriteOff }: WriteOffDebtorFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<DebtorWriteOffInput>({
    resolver: zodResolver(DebtorWriteOffSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit((payload) => onWriteOff(payload))}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="paid"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="paid">Сума списання*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="paid"
                  placeholder="0,00"
                  type="number"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="justify-end" orientation="horizontal">
            <Button
              className="relative bg-orange-600 hover:bg-orange-700 has-[>svg]:px-4"
              disabled={isSubmitting}
              type="submit"
            >
              <span className={isSubmitting ? "invisible" : "visible"}>
                Зберегти
              </span>
              {isSubmitting && (
                <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
