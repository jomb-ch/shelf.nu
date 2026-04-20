import type { ReactNode } from "react";
import type { Booking } from "@prisma/client";
import { BookingStatus, KitStatus } from "@prisma/client";
import { Link, useLoaderData } from "react-router";
import { hasAssetBookingConflicts } from "~/modules/booking/helpers";
import type { AssetWithBooking } from "~/routes/_layout+/bookings.$bookingId.overview.manage-assets";
import type { KitForBooking } from "~/routes/_layout+/bookings.$bookingId.overview.manage-kits";
import { SERVER_URL } from "~/utils/env";
import { tw } from "~/utils/tw";
import { Button } from "../shared/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shared/tooltip";

/**
 * There are 4 reasons an asset can be unavailable:
 * 1. Its marked as not allowed for booking
 * 2. It is already in custody
 * 3. It is already booked for that period (within another booking)
 * 4. It is part of a kit and user is trying to add it individually
 * Each reason has its own tooltip and label
 */
export function AvailabilityLabel({
  asset,
  isCheckedOut,
  showKitStatus,
  isAddedThroughKit,
  isAlreadyAdded,
}: {
  asset: AssetWithBooking;
  isCheckedOut: boolean;
  showKitStatus?: boolean;
  isAddedThroughKit?: boolean;
  isAlreadyAdded?: boolean;
}) {
  const { booking } = useLoaderData<{ booking: Booking }>();
  const isPartOfKit = !!asset.kitId;

  /** User scanned the asset and it is already in booking */
  if (isAlreadyAdded) {
    return (
      <AvailabilityBadge
        badgeText="Bereits hinzugefügt"
        tooltipTitle="Asset ist Teil der Buchung"
        tooltipContent="Dieses Asset wurde bereits zur aktuellen Buchung hinzugefügt."
      />
    );
  }

  /**
   * Marked as not allowed for booking
   */

  if (!asset.availableToBook) {
    return (
      <AvailabilityBadge
        badgeText={"Nicht verfügbar"}
        tooltipTitle={"Asset ist für Buchungen nicht verfügbar"}
        tooltipContent={
          "Dieses Asset wurde von einer Administratorin oder einem Administrator für Buchungen deaktiviert."
        }
      />
    );
  }

  /**
   * Asset is part of a kit
   */
  if (isPartOfKit && showKitStatus) {
    return (
      <AvailabilityBadge
        badgeText="Teil eines Kits"
        tooltipTitle="Asset ist Teil eines Kits"
        tooltipContent="Entfernen Sie das Asset aus dem Kit, um es einzeln hinzuzufügen."
      />
    );
  }

  /**
   * Has custody
   */
  if (asset.custody) {
    return (
      <AvailabilityBadge
        badgeText={"In Verwahrung"}
        tooltipTitle={"Asset ist in Verwahrung"}
        tooltipContent={
          "Dieses Asset ist aktuell einer Person zugewiesen und deshalb momentan nicht buchbar."
        }
      />
    );
  }

  /**
   * Is booked for period - using client-side helper function
   */
  if (
    hasAssetBookingConflicts(asset, booking.id) &&
    !["ONGOING", "OVERDUE"].includes(booking.status)
  ) {
    const conflictingBooking = asset?.bookings
      ?.filter(
        (b) =>
          b.id !== booking.id &&
          (b.status === BookingStatus.ONGOING ||
            b.status === BookingStatus.OVERDUE ||
            b.status === BookingStatus.RESERVED)
      )
      .sort((a, b) => {
        // Sort by 'from' date descending to get the newest booking first
        const aDate = a.from ? new Date(a.from).getTime() : 0;
        const bDate = b.from ? new Date(b.from).getTime() : 0;
        return bDate - aDate;
      })[0];
    return (
      <AvailabilityBadge
        badgeText={"Bereits gebucht"}
        tooltipTitle={"Asset ist bereits Teil einer Buchung"}
        tooltipContent={
          conflictingBooking ? (
            <span>
              Dieses Asset ist bereits einer Buchung (
              <Button
                to={`/bookings/${conflictingBooking.id}`}
                target="_blank"
                variant={"inherit"}
                className={"!underline"}
              >
                {conflictingBooking?.name}
              </Button>
              ) zugeordnet, die sich mit dem gewählten Zeitraum überschneidet.
            </span>
          ) : (
            "Dieses Asset ist bereits einer Buchung zugeordnet, die sich mit dem gewählten Zeitraum überschneidet."
          )
        }
      />
    );
  }

  /**
   * Is currently checked out
   */

  if (isCheckedOut) {
    /** We get the current active booking that the asset is checked out to so we can use its name in the tooltip contnet
     * NOTE: This will currently not work as we are returning only overlapping bookings with the query. I leave to code and we can solve it by modifying the DB queries: https://github.com/Shelf-nu/shelf.nu/pull/555#issuecomment-1877050925
     */
    const conflictingBooking = asset?.bookings
      ?.filter(
        (b) =>
          b.id !== booking.id &&
          (b.status === BookingStatus.ONGOING ||
            b.status === BookingStatus.OVERDUE)
      )
      .sort((a, b) => {
        // Sort by 'from' date descending to get the newest booking first
        const aDate = a.from ? new Date(a.from).getTime() : 0;
        const bDate = b.from ? new Date(b.from).getTime() : 0;
        return bDate - aDate;
      })[0];

    return (
      <AvailabilityBadge
        badgeText={"Ausgecheckt"}
        tooltipTitle={"Asset ist aktuell ausgecheckt"}
        tooltipContent={
          conflictingBooking ? (
            <span>
              Dieses Asset ist aktuell im Rahmen einer anderen Buchung
              ausgecheckt (
              <Link
                to={`${SERVER_URL}/bookings/
                ${conflictingBooking.id}`}
                target="_blank"
              >
                {conflictingBooking?.name}
              </Link>
              ) und sollte für Ihren gewählten Zeitraum wieder verfügbar sein
            </span>
          ) : (
            "Dieses Asset ist aktuell im Rahmen einer anderen Buchung ausgecheckt und sollte für Ihren gewählten Zeitraum wieder verfügbar sein."
          )
        }
      />
    );
  }

  /**
   * User is viewing all assets and the assets is added in a booking through kit
   */
  if (isAddedThroughKit) {
    return (
      <AvailabilityBadge
        badgeText="Über Kit hinzugefügt"
        tooltipTitle="Asset wurde über ein Kit hinzugefügt"
        tooltipContent="Entfernen Sie das Asset aus dem Kit, um es einzeln hinzuzufügen."
      />
    );
  }

  return null;
}

export function AvailabilityBadge({
  badgeText,
  tooltipTitle,
  tooltipContent,
  className,
}: {
  badgeText: string;
  tooltipTitle: string;
  tooltipContent: string | ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={tw(
              "inline-block  bg-warning-50 px-[6px] py-[2px]",
              "rounded-md border border-warning-200",
              "text-xs text-warning-700",
              "availability-badge",
              className
            )}
          >
            {badgeText}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          <div className="max-w-[260px] text-left sm:max-w-[320px]">
            <h6 className="mb-1 text-xs font-semibold text-gray-700">
              {tooltipTitle}
            </h6>
            <div className="whitespace-normal text-xs font-medium text-gray-500">
              {tooltipContent}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * A kit is not available for the following reasons
 * 1. Kit has unavailable status
 * 2. Kit or some asset is in custody
 * 3. Some of the assets are in custody
 * 4. Some of the assets are already booked for that period (for that booking)
 * 5. If kit has no assets
 */
export function getKitAvailabilityStatus(
  kit: KitForBooking,
  currentBookingId: string
) {
  const bookings = kit.assets
    .map((asset) => {
      if (asset?.bookings.length) {
        return asset.bookings;
      }
      return null;
    })
    .filter(Boolean)
    .flat();

  /** Checks whether this is checked out in another not overlapping booking */
  const isCheckedOutInANonConflictingBooking =
    kit.status === KitStatus.CHECKED_OUT && bookings.length === 0;
  const isCheckedOut = kit.status === KitStatus.CHECKED_OUT;
  const isInCustody =
    kit.status === "IN_CUSTODY" || kit.assets.some((a) => Boolean(a.custody));

  const isKitWithoutAssets = kit.assets.length === 0;

  const someAssetMarkedUnavailable = kit.assets.some((a) => !a.availableToBook);

  // Apply same booking conflict logic as isCheckedOut
  const someAssetHasUnavailableBooking = kit.assets.some((asset) =>
    hasAssetBookingConflicts(asset, currentBookingId)
  );

  return {
    isCheckedOut,
    isCheckedOutInANonConflictingBooking,
    isInCustody,
    isKitWithoutAssets,
    someAssetMarkedUnavailable,
    someAssetHasUnavailableBooking,
    isKitUnavailable: [isInCustody, isKitWithoutAssets].some(Boolean),
  };
}

export function KitAvailabilityLabel({ kit }: { kit: KitForBooking }) {
  const { booking } = useLoaderData<{ booking: Booking }>();

  const {
    isCheckedOut,
    isCheckedOutInANonConflictingBooking,
    someAssetMarkedUnavailable,
    isInCustody,
    isKitWithoutAssets,
    someAssetHasUnavailableBooking,
  } = getKitAvailabilityStatus(kit, booking.id);

  // Check if kit is checked out in current booking - don't show availability label
  const isCheckedOutInCurrentBooking =
    isCheckedOut &&
    kit.assets.some((asset) =>
      asset.bookings.some(
        (b) => b.id === booking.id && ["ONGOING", "OVERDUE"].includes(b.status)
      )
    );

  // Case 1: Kit is checked out in current booking - don't show availability label
  // The KitStatusBadge with CHECKED_OUT should be shown instead in the Row component
  if (isCheckedOutInCurrentBooking) {
    return null;
  }

  if (isInCustody) {
    return (
      <AvailabilityBadge
        badgeText="In Verwahrung"
        tooltipTitle="Kit ist in Verwahrung"
        tooltipContent="Dieses Kit ist in Verwahrung oder enthält Assets, die in Verwahrung sind."
      />
    );
  }

  if (isCheckedOut) {
    return (
      <AvailabilityBadge
        badgeText="Ausgecheckt"
        tooltipTitle="Kit ist ausgecheckt"
        tooltipContent={
          isCheckedOutInANonConflictingBooking
            ? "Dieses Kit ist aktuell im Rahmen einer anderen Buchung ausgecheckt und sollte für Ihren gewählten Zeitraum wieder verfügbar sein."
            : "Dieses Kit ist aktuell ausgecheckt und für Ihren gewählten Zeitraum nicht verfügbar."
        }
      />
    );
  }

  if (isKitWithoutAssets) {
    return (
      <AvailabilityBadge
        badgeText="Keine Assets"
        tooltipTitle="Keine Assets im Kit"
        tooltipContent="Diesem Kit wurden noch keine Assets hinzugefügt."
      />
    );
  }

  if (someAssetMarkedUnavailable) {
    return (
      <AvailabilityBadge
        badgeText="Enthält nicht buchbare Assets"
        tooltipTitle="Kit ist nicht für den Check-out verfügbar"
        tooltipContent="Einige Assets in diesem Kit sind als nicht buchbar markiert. Sie können das Kit trotzdem zur Buchung hinzufügen, müssen diese Assets aber vor dem Check-out entfernen."
      />
    );
  }

  if (someAssetHasUnavailableBooking) {
    return (
      <AvailabilityBadge
        badgeText="Bereits gebucht"
        tooltipTitle="Kit ist bereits Teil einer Buchung"
        tooltipContent="Dieses Kit wurde bereits zu einer anderen Buchung hinzugefügt."
      />
    );
  }

  return null;
}
