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
import { useUpsertDebtor } from "@/hooks/api/debtor/use-upsert-debtor";
import {
  type DebtorCreateInput,
  DebtorCreateSchema,
} from "@/schemas/debtor/debtor-schema";

type CreateDebtorFormProps = {
  isLoading: boolean;
};

export function CreateDebtorForm({ isLoading }: CreateDebtorFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
    getValues,
  } = useForm<DebtorCreateInput>({
    resolver: zodResolver(DebtorCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { currentShift } = useShiftContext();
  const { mutateAsync: createDebtor } = useUpsertDebtor({
    shiftId: currentShift.id,
  });

  const onSubmit = async (payload: DebtorCreateInput) => {
    await createDebtor(payload);
    toast.success("Боржника успішно створено!", {
      description: `Створено витрату на ${getValues("newDebtAmount")} ₴.`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="name">Ім'я*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading || isSubmitting}
                  id="name"
                  placeholder="Прізвище Ім'я По батькові"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="newDebtAmount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="newDebtAmount">Сума боргу*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading || isSubmitting}
                  id="newDebtAmount"
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
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-primary-foreground has-[>svg]:px-4 dark:border-orange-600 dark:hover:bg-orange-600"
              disabled={isLoading || isSubmitting}
              type="submit"
              variant="outline"
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <Plus />
                  <div>Додати</div>
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
