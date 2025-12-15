"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useShiftContext } from "@/context/shift-context";
import { useCreateAdditionalIncome } from "@/hooks/api/additional-income/use-create-additional-income";
import {
  type AdditionalIncomeCreateInput,
  AdditionalIncomeCreateSchema,
} from "@/schemas/additional-income-schema";

export function CreateAdditionalIncomeForm() {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<AdditionalIncomeCreateInput>({
    resolver: zodResolver(AdditionalIncomeCreateSchema),
    defaultValues: {
      category: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { currentShift } = useShiftContext();
  const { mutateAsync: createAdditionalIncome } = useCreateAdditionalIncome({
    shiftId: currentShift.id,
  });

  const onSubmit = async (payload: AdditionalIncomeCreateInput) => {
    await createAdditionalIncome(payload);
    toast.success("Надходження успішно створено!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Controller
            control={control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="category">Джерело</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="category"
                  placeholder="Джерело"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="amount">Сума надходження*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="amount"
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

          <Field>
            <Label className="text-card">.</Label>
            <Button
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-primary-foreground has-[>svg]:px-4 dark:border-indigo-600 dark:hover:bg-indigo-600"
              disabled={isSubmitting}
              type="submit"
              variant="outline"
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <Plus />
                  <p>Додати</p>
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
