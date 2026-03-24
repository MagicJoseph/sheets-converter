import { Textarea, Label, Select } from "@/components/ui/primitives";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Separator } from "@/lib/fields";

const PLACEHOLDER = `id,title,description,link,requiresCode,accessCode,category,type,role
mat-001,Introduction to Linear Algebra,A beginner-friendly walkthrough of vectors and matrices.,https://www.youtube.com/watch?v=fNk_zzaMoSs,FALSE,,kick_off,article,"UX, PM"
mat-002,Probability & Statistics,Comprehensive lecture series.,https://www.youtube.com/watch?v=xxpc-HPKN28,TRUE,STAT2024,user_research,notebook_lm,"UX, PM"`;

interface CsvInputProps {
  csv: string;
  sep: Separator;
  onCsvChange: (raw: string) => void;
  onSepChange: (sep: Separator) => void;
}

export function CsvInput({ csv, sep, onCsvChange, onSepChange }: CsvInputProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">1. Wklej CSV</CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Separator</Label>
            <Select
              value={sep}
              onChange={(e) => onSepChange(e.target.value as Separator)}
              className="h-7 text-xs w-auto"
            >
              <option value=",">Przecinek</option>
              <option value=";">Średnik</option>
              <option value={"\t"}>Tab</option>
            </Select>
          </div>
        </div>
        <CardDescription className="text-xs">
          File → Download → CSV lub File → Share → Publish to web → CSV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={csv}
          onChange={(e) => onCsvChange(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={9}
          className="text-xs resize-y"
        />
      </CardContent>
    </Card>
  );
}
