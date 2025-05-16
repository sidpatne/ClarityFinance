
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Settings as SettingsIcon, Palette, Languages, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

type ThemeValue = "light" | "dark" | "system";
const THEME_STORAGE_KEY = "app-theme";
const LANGUAGE_STORAGE_KEY = "app-language";
const CURRENCY_STORAGE_KEY = "app-currency";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState<ThemeValue>("system");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0].value);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currencies[0].value);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeValue | null;
    if (storedTheme) {
      setSelectedTheme(storedTheme);
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }

    const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }
    setMounted(true);
  }, []);

  // Apply and save theme
  useEffect(() => {
    if (!mounted) return; // Ensure this runs only after initial state is set from localStorage

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme = selectedTheme;
    if (selectedTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    root.classList.add(effectiveTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme); // Store the user's *choice* (light, dark, or system)
  }, [selectedTheme, mounted]);

  // System theme change listener
  useEffect(() => {
    if (!mounted || selectedTheme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [selectedTheme, mounted]);

  // Save language
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
  }, [selectedLanguage, mounted]);

  // Save currency
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CURRENCY_STORAGE_KEY, selectedCurrency);
  }, [selectedCurrency, mounted]);


  if (!mounted) {
    // Optional: Render a loading state or null to prevent UI flicker/mismatch during hydration
    return null; 
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences."
        icon={SettingsIcon}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Theme</CardTitle>
            <CardDescription>Choose your preferred application theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedTheme}
              onValueChange={(value: string) => setSelectedTheme(value as ThemeValue)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5" /> Language</CardTitle>
            <CardDescription>Select your display language.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5" /> Currency</CardTitle>
            <CardDescription>Set your default currency for display.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
