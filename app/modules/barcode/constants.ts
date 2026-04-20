import { BarcodeType } from "@prisma/client";

export const BARCODE_TYPE_OPTIONS = [
  {
    value: BarcodeType.Code128,
    label: "Code 128",
    description:
      "4-40 Zeichen, unterstützt Buchstaben, Zahlen und Symbole (z. B. ABC-123)",
  },
  {
    value: BarcodeType.Code39,
    label: "Code 39",
    description: "4-43 Zeichen, nur Buchstaben und Zahlen (z. B. ABC123)",
  },
  {
    value: BarcodeType.DataMatrix,
    label: "DataMatrix",
    description:
      "4-100 Zeichen, unterstützt Buchstaben, Zahlen und Symbole (z. B. ABC-123)",
  },
  {
    value: BarcodeType.ExternalQR,
    label: "External QR",
    description:
      "1-2048 Zeichen, URLs, Text oder beliebige externe QR-Inhalte (z. B. https://example.com)",
  },
  {
    value: BarcodeType.EAN13,
    label: "EAN-13",
    description:
      "Genau 13 Ziffern. Für Handelsbarcodes (13-stellige Produktkennzeichnungen)",
  },
];
