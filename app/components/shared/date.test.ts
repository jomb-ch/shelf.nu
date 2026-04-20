import { describe, expect, it } from "vitest";

import { formatAbsoluteDate } from "./date";

// Normalize process timezone to ensure consistent expectations
process.env.TZ = "America/Los_Angeles";

const basicOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

describe("formatAbsoluteDate", () => {
  it("formats identical output for ISO string and Date object", () => {
    const isoDate = "2025-11-29T00:00:00.000Z";
    const fromString = formatAbsoluteDate(isoDate, basicOptions);
    const fromDate = formatAbsoluteDate(new Date(isoDate), basicOptions);

    expect(fromDate).toEqual(fromString);
  });

  it("throws for invalid Date objects", () => {
    expect(() => formatAbsoluteDate(new Date("invalid"), basicOptions)).toThrow(
      "Invalid Date object"
    );
  });

  it("keeps absolute dates across timezone boundaries", () => {
    const boundaryIso = "2025-11-29T07:59:59.000Z"; // 11/28 23:59:59 PST
    const formatted = formatAbsoluteDate(boundaryIso, basicOptions);

    expect(formatted).toEqual("29.11.2025");
  });

  it("respects Swiss German formatting options by default", () => {
    const isoDate = "2025-11-29T00:00:00.000Z";
    const formatted = formatAbsoluteDate(isoDate, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    expect(formatted).toEqual("Samstag, 29. November 2025");
  });

  it("allows overriding the locale explicitly", () => {
    const isoDate = "2025-11-29T00:00:00.000Z";
    const formatted = formatAbsoluteDate(
      isoDate,
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      "en-US"
    );

    expect(formatted).toEqual("Saturday, November 29, 2025");
  });
});
