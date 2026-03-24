export const FIELDS = [
  "id",
  "title",
  "description",
  "link",
  "requiresCode",
  "accessCode",
  "category",
  "type",
  "roles",
] as const;

export type Field = (typeof FIELDS)[number];

export const REQUIRED_FIELDS: Field[] = ["title", "link"];

export const BOOLEAN_FIELDS: Field[] = ["requiresCode"];

export const ARRAY_FIELDS: Field[] = ["roles"];

export type Separator = "," | ";" | "\t";

export type OutputFormat = "ts" | "json";
