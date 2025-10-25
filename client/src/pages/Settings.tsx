import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { Palette, Sparkles, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="p-8 space-y-8 max-w-4xl animate-fade-in-up" data-testid="page-settings">
      <div>
        <h1 className="text-4xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your TaskFlow Studio experience
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">Theme</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred visual theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value: any) => setTheme(value)} data-testid="radiogroup-theme">
            <div className="space-y-4">
              {themes.map((t) => (
                <div key={t.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate transition-all">
                  <RadioGroupItem value={t.value} id={t.value} data-testid={`radio-theme-${t.value}`} />
                  <Label htmlFor={t.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{t.label}</div>
                    <div className="text-sm text-muted-foreground">{t.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* AI Provider Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">AI Provider</CardTitle>
          </div>
          <CardDescription>
            Configure AI model preferences and API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Default Provider</Label>
            <RadioGroup defaultValue="huggingface" data-testid="radiogroup-ai-provider">
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate transition-all">
                <RadioGroupItem value="huggingface" id="huggingface" data-testid="radio-provider-huggingface" />
                <Label htmlFor="huggingface" className="flex-1 cursor-pointer">
                  <div className="font-medium">Hugging Face (Free)</div>
                  <div className="text-sm text-muted-foreground">Open-source models, no API key required</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate transition-all">
                <RadioGroupItem value="openrouter" id="openrouter" data-testid="radio-provider-openrouter" />
                <Label htmlFor="openrouter" className="flex-1 cursor-pointer">
                  <div className="font-medium">OpenRouter (Premium)</div>
                  <div className="text-sm text-muted-foreground">Access to GPT, Claude, Gemini, and more</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenRouter API Key (Optional)
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              data-testid="input-api-key"
            />
            <p className="text-xs text-muted-foreground">
              Only needed if you want to use premium AI models via OpenRouter
            </p>
          </div>

          <Button variant="default" data-testid="button-save-settings">
            <Sparkles className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Tutorial */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Tutorial</CardTitle>
          <CardDescription>
            Replay the welcome tutorial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('taskflow-tutorial-completed');
              window.location.reload();
            }}
            data-testid="button-replay-tutorial"
          >
            Replay Tutorial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
