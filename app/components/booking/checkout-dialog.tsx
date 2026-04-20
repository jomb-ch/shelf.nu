import type { Booking } from "@prisma/client";
import { isBookingEarlyCheckout } from "~/modules/booking/helpers";
import type { ButtonProps } from "../shared/button";
import { Button } from "../shared/button";
import { DateS } from "../shared/date";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../shared/modal";

export enum CheckoutIntentEnum {
  "with-adjusted-date" = "with-adjusted-date",
  "without-adjusted-date" = "without-adjusted-date",
}

type CheckoutDialogProps = {
  disabled?: ButtonProps["disabled"];
  booking: Pick<Booking, "id" | "name" | "from">;
  /** A container to render the AlertContent inside */
  portalContainer?: HTMLElement;
};

export default function CheckoutDialog({
  disabled,
  booking,
  portalContainer,
}: CheckoutDialogProps) {
  const isEarlyCheckout = isBookingEarlyCheckout(booking.from);

  if (!isEarlyCheckout) {
    return (
      <Button
        disabled={disabled}
        className="grow"
        size="sm"
        type="submit"
        name="intent"
        value="checkOut"
      >
        Check-out
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} className="grow" size="sm" type="button">
          Check-out
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent portalProps={{ container: portalContainer }}>
        <AlertDialogHeader>
          <AlertDialogTitle>Warnung: früher Check-out</AlertDialogTitle>
          <AlertDialogDescription>
            Sie checken diese Buchung mehr als 15 Minuten vor dem Startdatum
            aus. Wenn Sie fortfahren, wird das Startdatum auf jetzt gesetzt:{" "}
            <span className="font-bold text-gray-700">
              <DateS date={new Date()} includeTime />
            </span>
            .
            <br />
            <br />
            Möchten Sie das Startdatum anpassen oder das ursprüngliche Datum
            beibehalten?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button disabled={disabled} variant="secondary">
              Abbrechen
            </Button>
          </AlertDialogCancel>

          <input type="hidden" name="intent" value="checkOut" />
          <Button
            disabled={disabled}
            className="flex-1"
            type="submit"
            variant="secondary"
            name="checkoutIntentChoice"
            value={CheckoutIntentEnum["without-adjusted-date"]}
          >
            Datum nicht anpassen
          </Button>

          <Button
            disabled={disabled}
            className="flex-1"
            type="submit"
            name="checkoutIntentChoice"
            value={CheckoutIntentEnum["with-adjusted-date"]}
          >
            Datum anpassen
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
