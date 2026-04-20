import { Close } from "@radix-ui/react-dialog";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, ClockIcon, InfoIcon } from "lucide-react";
import { tw } from "~/utils/tw";
import { XIcon } from "../icons/library";
import { Button } from "../shared/button";
import { Sheet, SheetContent, SheetTrigger } from "../shared/sheet";

type BookingProcessSidebarProps = {
  className?: string;
};

type ProcessItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName: string;
};

const ITEMS: Array<ProcessItem> = [
  {
    icon: ClockIcon,
    title: "Anfrage senden",
    description:
      'Füllen Sie alle Pflichtfelder aus und wählen Sie die benötigten Assets. Klicken Sie auf "Reservierung anfragen", um Ihre Anfrage zu senden.',
    iconClassName: "bg-blue-100 text-blue-500",
  },
  {
    icon: InfoIcon,
    title: "Admin-Prüfung",
    description:
      "Ihre Buchung wird als reserviert angezeigt. Administratoren können sie jedoch jederzeit wieder in den Entwurf zurücksetzen oder stornieren, falls es Konflikte mit anderen Buchungen gibt.",
    iconClassName: "bg-warning-100 text-warning-500",
  },
  {
    icon: ArrowRight,
    title: "Check-out",
    description:
      "Zum Startzeitpunkt Ihrer Buchung checkt eine Administratorin oder ein Administrator das Equipment für Sie aus. Während der Buchungsdauer tragen Sie die Verantwortung dafür.",
    iconClassName: "bg-violet-100 text-violet-500",
  },
  {
    icon: ArrowLeft,
    title: "Check-in",
    description:
      "Am Ende Ihrer Buchung geben Sie das Equipment zurück, damit eine Administratorin oder ein Administrator den Check-in abschliessen kann.",
    iconClassName: "bg-indigo-100 text-indigo-500",
  },
];

export default function BookingProcessSidebar({
  className,
}: BookingProcessSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="block-link-gray" className={"mt-0"}>
          <div className="flex items-center gap-2">
            <InfoIcon className="size-4" />
            So funktionieren Buchungen
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent
        hideCloseButton
        className={tw("border-l-0 bg-white p-0", className)}
      >
        <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
          <div className="flex items-center gap-2 text-lg font-bold">
            <InfoIcon className="size-4" />
            Buchungsablauf
          </div>

          <Close className="opacity-70 transition-opacity hover:opacity-100">
            <XIcon className="size-4" />
            <span className="sr-only">Schliessen</span>
          </Close>
        </div>

        <div className="p-4">
          <p className="mb-8 border-l-4 border-blue-500 bg-blue-50 p-2 text-blue-500">
            Basis-Benutzer reservieren Buchungen, die eine Freigabe durch Admins
            benötigen und bei Konflikten mit anderen Buchungen jederzeit
            storniert werden können. Admins übernehmen Check-out und Check-in
            des Equipments.
          </p>

          <div className="mb-8 flex flex-col gap-4">
            {ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className={tw(
                    "flex items-center justify-center rounded-full p-4",
                    item.iconClassName
                  )}
                >
                  {}
                  <item.icon className="size-5" />
                </div>

                <div>
                  <h3 className="mb-1">
                    {i + 1}. {item.title}
                  </h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="mb-1">Wichtige Hinweise</h3>

            <ul className="list-inside list-disc">
              <li>
                Das Equipment muss im gleichen Zustand zurückgegeben werden, in
                dem es ausgecheckt wurde.
              </li>
              <li>
                Wenn Sie Ihre Buchung verlängern möchten, kontaktieren Sie vor
                dem Enddatum eine Administratorin oder einen Administrator.
              </li>
              <li>
                Administratoren entscheiden abschliessend über Freigaben,
                basierend auf Verfügbarkeit und Prioritäten.
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
