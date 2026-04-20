import { describe, expect, it } from "vitest";

import {
  translateBookingStatus,
  translateNotificationContent,
  translateToDeCh,
} from "./de-ch";

describe("translateToDeCh", () => {
  it("translates exact UI strings", () => {
    expect(translateToDeCh("Quick find")).toBe("Schnellsuche");
    expect(translateToDeCh("Pending invites")).toBe("Ausstehende Einladungen");
    expect(translateToDeCh("Search assets")).toBe("Assets suchen");
    expect(translateToDeCh("Action disabled")).toBe("Aktion nicht verfügbar");
  });

  it("translates regex-based dynamic strings", () => {
    expect(translateToDeCh("2 remaining")).toBe("2 verbleibend");
    expect(translateToDeCh("Current page, page 5")).toBe(
      "Aktuelle Seite, Seite 5"
    );
    expect(translateToDeCh("Delete (12) assets")).toBe("Assets löschen (12)");
    expect(
      translateToDeCh("You must select at least 1 asset to perform an action")
    ).toBe("Wählen Sie mindestens 1 Asset aus, um eine Aktion auszuführen.");
  });

  it("translates common notification content", () => {
    expect(
      translateNotificationContent({
        title: "Category deleted",
        message: "Your category has been deleted successfully",
      })
    ).toEqual({
      title: "Kategorie gelöscht",
      message: "Ihre Kategorie wurde erfolgreich gelöscht.",
    });
  });

  it("translates status labels", () => {
    expect(translateBookingStatus("Reserved")).toBe("Reserviert");
    expect(translateBookingStatus("Overdue")).toBe("Überfällig");
  });
});
