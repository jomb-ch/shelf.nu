import { useRef } from "react";
import { useActionData } from "react-router";
import { useZorm } from "react-zorm";
import z from "zod";
import { Form } from "~/components/custom-form";
import FormRow from "~/components/forms/form-row";
import Input from "~/components/forms/input";
import { Button } from "~/components/shared/button";
import { Card } from "~/components/shared/card";
import { Spinner } from "~/components/shared/spinner";
import { useDisabled } from "~/hooks/use-disabled";
import type { BookingSettingsActionData } from "~/routes/_layout+/settings.bookings";
import { getValidationErrors } from "~/utils/http";
import { handleActivationKeyPress } from "~/utils/keyboard";

export const TimeSettingsSchema = z.object({
  bufferStartTime: z.coerce
    .number()
    .min(0, "Der Puffer muss mindestens 0 Stunden betragen")
    .max(168, "Der Puffer darf 168 Stunden (7 Tage) nicht überschreiten"),
  maxBookingLength: z.coerce
    .number()
    .min(1, "Die maximale Buchungsdauer muss mindestens 1 Stunde betragen")
    .max(
      8760,
      "Die maximale Buchungsdauer darf 8760 Stunden (1 Jahr) nicht überschreiten"
    )
    .optional()
    .or(z.literal("")),
  maxBookingLengthSkipClosedDays: z
    .string()
    .transform((val) => val === "on")
    .default("false"),
});

export function TimeSettings({
  header,
  defaultBufferValue = 0,
  defaultMaxLengthValue = null,
  defaultMaxBookingLengthSkipClosedDays = false,
}: {
  header: { title: string; subHeading?: string };
  defaultBufferValue: number;
  defaultMaxLengthValue: number | null;
  defaultMaxBookingLengthSkipClosedDays: boolean;
}) {
  const disabled = useDisabled();
  const zo = useZorm("EnableWorkingHoursForm", TimeSettingsSchema);
  const maxBookingLengthSkipClosedDaysRef = useRef<HTMLInputElement>(null);

  const actionData = useActionData<BookingSettingsActionData>();
  /** This handles server side errors in case client side validation fails */
  const validationErrors = getValidationErrors<typeof TimeSettingsSchema>(
    actionData?.error
  );

  return (
    <Card>
      <div className="mb-4 border-b pb-4">
        <h3 className="text-text-lg font-semibold">{header.title}</h3>
        <p className="text-sm text-gray-600">{header.subHeading}</p>
      </div>
      <div>
        <Form ref={zo.ref} method="post">
          <FormRow
            rowLabel={`Minimale Vorlaufzeit (Stunden)`}
            subHeading={
              <div>
                Benutzer müssen mindestens so viele Stunden vor dem
                Buchungsstart buchen. Geben Sie 0 ein, um sofortige Buchungen zu
                erlauben. Diese Einschränkung gilt nur für{" "}
                <strong>Self service</strong>- und <strong>Base</strong>-Rollen.
              </div>
            }
            className="border-b-0 pb-[10px] pt-0"
            required
          >
            <Input
              label="Minimale Vorlaufzeit (Stunden)"
              hideLabel
              type="number"
              name={zo.fields.bufferStartTime()}
              disabled={disabled}
              defaultValue={defaultBufferValue}
              required
              title={"Minimale Vorlaufzeit (Stunden)"}
              min={0}
              max={168}
              step={1}
              inputClassName="w-24"
              error={
                validationErrors?.bufferStartTime?.message ||
                zo.errors.bufferStartTime()?.message
              }
            />
          </FormRow>

          <FormRow
            rowLabel={`Maximale Buchungsdauer (Stunden)`}
            subHeading={
              <div>
                Legen Sie die maximale Dauer für eine einzelne Buchung fest.
                Leer lassen bedeutet kein Limit. Das verhindert übermässig lange
                Buchungen.
              </div>
            }
            className="border-b-0 pb-[10px]"
          >
            <div className="flex flex-col">
              <Input
                label="Maximale Buchungsdauer (Stunden)"
                hideLabel
                type="number"
                name={zo.fields.maxBookingLength()}
                disabled={disabled}
                defaultValue={defaultMaxLengthValue || ""}
                placeholder="Kein Limit"
                title={"Maximale Buchungsdauer (Stunden)"}
                min={1}
                max={8760}
                step={1}
                inputClassName="w-24"
                error={
                  validationErrors?.maxBookingLength?.message ||
                  zo.errors.maxBookingLength()?.message
                }
              />
              <div className="mt-2 flex items-center gap-2">
                <Input
                  id="maxBookingLengthSkipClosedDays"
                  label="Geschlossene Tage überspringen"
                  hideLabel
                  type="checkbox"
                  name={zo.fields.maxBookingLengthSkipClosedDays()}
                  disabled={disabled}
                  defaultChecked={
                    defaultMaxBookingLengthSkipClosedDays || false
                  }
                  title={"Skip closed days"}
                  error={
                    validationErrors?.maxBookingLengthSkipClosedDays?.message ||
                    zo.errors.maxBookingLengthSkipClosedDays()?.message
                  }
                  className="inline-block w-[18px]"
                  inputClassName="px-[9px]"
                  ref={maxBookingLengthSkipClosedDaysRef}
                />
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (maxBookingLengthSkipClosedDaysRef.current) {
                      maxBookingLengthSkipClosedDaysRef.current.click();
                    }
                  }}
                  onKeyDown={handleActivationKeyPress(() => {
                    if (maxBookingLengthSkipClosedDaysRef.current) {
                      maxBookingLengthSkipClosedDaysRef.current.click();
                    }
                  })}
                  className="cursor-default"
                >
                  Geschlossene Tage überspringen
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Geschlossene Tage werden bei der Berechnung nicht
                berücksichtigt.
              </p>
            </div>
          </FormRow>

          <div className="text-right">
            <Button
              type="submit"
              disabled={disabled}
              value="updateTimeSettings"
              name="intent"
            >
              {disabled ? <Spinner /> : "Einstellungen speichern"}
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
}
