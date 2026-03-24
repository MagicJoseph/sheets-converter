import { useState, useCallback } from "react";
import { FileCode2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Field, Separator, OutputFormat } from "@/lib/fields";
import { parseCSVRow, autoMapHeaders, parseCSV, toTypeScript, toJSON } from "@/lib/parser";
import { CsvInput } from "@/components/CsvInput";
import { ColumnMapping } from "@/components/ColumnMapping";
import { OutputPanel } from "@/components/OutputPanel";

export function Converter() {
  const [csv, setCsv] = useState("");
  const [sep, setSep] = useState<Separator>(",");
  const [format, setFormat] = useState<OutputFormat>("ts");
  const [mapping, setMapping] = useState<Record<Field, string>>({} as Record<Field, string>);
  const [headers, setHeaders] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [count, setCount] = useState<number | null>(null);

  const handleCsvChange = useCallback(
    (raw: string) => {
      setCsv(raw);
      if (!raw.trim()) { setHeaders([]); return; }
      const firstLine = raw.trim().split(/\r?\n/)[0];
      const detected = parseCSVRow(firstLine, sep);
      setHeaders(detected);
      setMapping(autoMapHeaders(detected));
    },
    [sep]
  );

  const handleSepChange = useCallback(
    (newSep: Separator) => {
      setSep(newSep);
      if (!csv.trim()) return;
      const firstLine = csv.trim().split(/\r?\n/)[0];
      const detected = parseCSVRow(firstLine, newSep);
      setHeaders(detected);
      setMapping(autoMapHeaders(detected));
    },
    [csv]
  );

  const handleMappingChange = useCallback(
    (field: Field, value: string) => {
      setMapping((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const convert = useCallback(() => {
    const { items, errors: errs } = parseCSV(csv, sep, mapping);
    setErrors(errs);
    setCount(items.length);
    setOutput(format === "ts" ? toTypeScript(items) : toJSON(items));
  }, [csv, sep, mapping, format]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Sheets → TS Converter</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Eksportuj CSV z Google Sheets i zamień na TypeScript gotowy do wklejenia w prototypie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CsvInput
              csv={csv}
              sep={sep}
              onCsvChange={handleCsvChange}
              onSepChange={handleSepChange}
            />
            <ColumnMapping
              headers={headers}
              mapping={mapping}
              onMappingChange={handleMappingChange}
            />
          </div>

          <div className="space-y-4">
            <OutputPanel
              output={output}
              errors={errors}
              count={count}
              format={format}
              onFormatChange={setFormat}
              onConvert={convert}
            />
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">
              Wygenerowany plik wklej jako <code className="bg-muted px-1 rounded">src/data/materials.ts</code> w projekcie Figma Make.
              Pamiętaj żeby dodać typ <code className="bg-muted px-1 rounded">Material</code> w <code className="bg-muted px-1 rounded">src/types/material.ts</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
