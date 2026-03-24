import { useState, useCallback } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, Badge } from "@/components/ui/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OutputFormat } from "@/lib/fields";

interface OutputPanelProps {
  output: string;
  errors: string[];
  count: number | null;
  format: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  onConvert: () => void;
}

export function OutputPanel({
  output,
  errors,
  count,
  format,
  onFormatChange,
  onConvert,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [output]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">3. Wynik</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={format}
              onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
              className="h-7 text-xs w-auto"
            >
              <option value="ts">TypeScript</option>
              <option value="json">JSON</option>
            </Select>
            {count !== null && (
              <Badge variant={count > 0 ? "success" : "secondary"}>
                {count} rekordów
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button onClick={onConvert} className="flex-1" size="sm">
            Konwertuj
          </Button>
          <Button
            onClick={copyOutput}
            variant="outline"
            size="sm"
            disabled={!output}
            className="gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Skopiowano" : "Kopiuj"}
          </Button>
        </div>

        {errors.length > 0 && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 space-y-1">
            {errors.map((e, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {e}
              </div>
            ))}
          </div>
        )}

        <pre className="flex-1 min-h-[320px] text-xs bg-muted rounded-md p-3 overflow-auto whitespace-pre-wrap break-all text-muted-foreground">
          {output || "// tu pojawi się wygenerowany kod"}
        </pre>
      </CardContent>
    </Card>
  );
}
