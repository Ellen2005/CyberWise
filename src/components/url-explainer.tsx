'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link2, AlertTriangle, Info } from 'lucide-react';
import { analyzeUrl } from '@/lib/security/url-signals';

export function UrlExplainer() {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const analysis = checked && value.trim() ? analyzeUrl(value) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline"><Link2 className="h-5 w-5" />URL signal checker</CardTitle>
        <CardDescription>
          Paste a link to see what it is made of — in plain language. No internet lookups, no tracking.
          "No warning detected" never means guaranteed safe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); setChecked(true); }}
        >
          <div className="flex-1 space-y-1">
            <Label htmlFor="url-input">Link to inspect</Label>
            <Input
              id="url-input"
              value={value}
              onChange={(e) => { setValue(e.target.value); setChecked(false); }}
              placeholder="e.g. paypal.com.secure-login.co/verify"
              className="font-mono text-sm"
              inputMode="url"
            />
          </div>
          <Button type="submit" disabled={!value.trim()} className="min-h-[44px] sm:self-end">Explain this link</Button>
        </form>
        {analysis && (
          <div className="space-y-2">
            {analysis.signals.map((s, i) => (
              <Alert key={i} variant={s.level === 'warn' ? 'destructive' : 'default'}>
                {s.level === 'warn' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                <AlertTitle>{s.label}</AlertTitle>
                <AlertDescription>{s.detail}</AlertDescription>
              </Alert>
            ))}
            <p className="text-xs text-muted-foreground">
              Rule of thumb: type important addresses yourself. When in doubt, do not tap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
