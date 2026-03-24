import { Info } from "lucide-react";
import { Label, Select } from "@/components/ui/primitives";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FIELDS, REQUIRED_FIELDS, type Field } from "@/lib/fields";

interface ColumnMappingProps {
  headers: string[];
  mapping: Record<Field, string>;
  onMappingChange: (field: Field, value: string) => void;
}

export function ColumnMapping({ headers, mapping, onMappingChange }: ColumnMappingProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">2. Mapowanie kolumn</CardTitle>
        <CardDescription className="text-xs">
          Przypisz kolumny arkusza do pól modelu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {headers.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Wklej CSV żeby zobaczyć mapowanie.
          </div>
        ) : (
          <div className="grid gap-y-2">
            {FIELDS.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <Label className="text-xs w-28 shrink-0 font-mono">
                  {f}
                  {REQUIRED_FIELDS.includes(f) && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                <Select
                  value={mapping[f] || ""}
                  onChange={(e) => onMappingChange(f, e.target.value)}
                  className="h-7 text-xs flex-1 min-w-0"
                >
                  <option value="">— pomiń —</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
