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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useShiftContext } from "@/context/shift-context";
import { useCreateExpense } from "@/hooks/api/expense/use-create-expense";
import { expenseCategories } from "@/lib/constants/expense-categories";
import {
  type ExpenseCreateInput,
  ExpenseCreateSchema,
} from "@/schemas/expense/expense-schema";

type CreateExpenseFormProps = {
  isLoading: boolean;
};

export function CreateExpenseForm({ isLoading }: CreateExpenseFormProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
    handleSubmit,
    control,
  } = useForm<ExpenseCreateInput>({
    resolver: zodResolver(ExpenseCreateSchema),
    defaultValues: {
      category: "OTHER",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { currentShift } = useShiftContext();
  const { mutateAsync: createExpense } = useCreateExpense({
    shiftId: currentShift.id,
  });

  const onSubmit = async (payload: ExpenseCreateInput) => {
    await createExpense(payload);
    toast.success("Витрату успішно створено!");
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
                <Label htmlFor="category">Категорія*</Label>

                <Select
                  disabled={isLoading || isSubmitting}
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    id="category"
                  >
                    <SelectValue placeholder="Обрати категорію..." />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem
                        key={category.key}
                        value={String(category.key)}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="amount">Сума витрати*</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading || isSubmitting}
                  id="amount"
                  placeholder="0,00"
                  type="number"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}{" "}
              </Field>
            )}
          />

          <Field>
            <Label className="text-card">.</Label>
            <Button
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-primary-foreground has-[>svg]:px-4 dark:border-red-600 dark:hover:bg-red-600"
              disabled={isLoading || isSubmitting}
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
