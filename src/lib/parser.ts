import type { Material } from "@/types/material";
import { FIELDS, BOOLEAN_FIELDS, ARRAY_FIELDS, type Field, type Separator } from "@/lib/fields";

export type { Material };

export function parseCSVRow(row: string, sep: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') {
      inQ = !inQ;
    } else if (!inQ && row.slice(i, i + sep.length) === sep) {
      result.push(cur.trim().replace(/^"|"$/g, ""));
      cur = "";
      i += sep.length - 1;
    } else {
      cur += c;
    }
  }
  result.push(cur.trim().replace(/^"|"$/g, ""));
  return result;
}

export function autoMapHeaders(headers: string[]): Record<Field, string> {
  const mapping = {} as Record<Field, string>;
  FIELDS.forEach((f) => {
    const match = headers.find(
      (h) => h.toLowerCase().replace(/[\s_-]/g, "") === f.toLowerCase()
    );
    mapping[f] = match || "";
  });
  return mapping;
}

export function parseCSV(
  raw: string,
  sep: Separator,
  mapping: Record<Field, string>
): { items: Partial<Material>[]; errors: string[] } {
  const errors: string[] = [];
  const lines = raw
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim());
  if (lines.length < 2) {
    errors.push(
      "Za mało wierszy — potrzebny nagłówek + przynajmniej 1 wiersz danych."
    );
    return { items: [], errors };
  }

  const headers = parseCSVRow(lines[0], sep);
  const colIdx = Object.fromEntries(
    FIELDS.map((f) => [f, mapping[f] ? headers.indexOf(mapping[f]) : -1])
  ) as Record<Field, number>;

  const items = lines
    .slice(1)
    .map((line, i) => {
      const vals = parseCSVRow(line, sep);
      const obj: Partial<Material> = {};
      FIELDS.forEach((f) => {
        if (colIdx[f] >= 0) {
          const val = vals[colIdx[f]]?.trim() || "";
          if (val) {
            if (BOOLEAN_FIELDS.includes(f)) {
              (obj as Record<string, boolean>)[f] = val.toUpperCase() === "TRUE";
            } else if (ARRAY_FIELDS.includes(f)) {
              (obj as Record<string, string[]>)[f] = val.split(",").map((s) => s.trim()).filter(Boolean);
            } else {
              (obj as Record<string, string>)[f] = val;
            }
          }
        }
      });
      BOOLEAN_FIELDS.forEach((f) => {
        if ((obj as Record<string, unknown>)[f] === undefined) {
          (obj as Record<string, boolean>)[f] = false;
        }
      });
      if (!obj.title && !obj.link) {
        errors.push(`Wiersz ${i + 2}: brak tytułu i linku — pominięto.`);
        return null;
      }
      return obj;
    })
    .filter(Boolean) as Partial<Material>[];

  return { items, errors };
}

export function toTypeScript(items: Partial<Material>[]): string {
  const body = items
    .map((o) => {
      const lines = FIELDS.map((f) => {
        const val = (o as Record<string, unknown>)[f];
        if (val === undefined || val === null || val === "") return null;
        if (typeof val === "boolean") return `    ${f}: ${val}`;
        if (Array.isArray(val)) return `    ${f}: [${val.map((v: string) => `"${v}"`).join(", ")}]`;
        return `    ${f}: "${val}"`;
      }).filter(Boolean);
      return "  {\n" + lines.join(",\n") + "\n  }";
    })
    .join(",\n");

  return `import type { Material } from "@/types/material";\n\nexport const materials: Material[] = [\n${body}\n];\n`;
}

export function toJSON(items: Partial<Material>[]): string {
  return JSON.stringify(items, null, 2);
}
