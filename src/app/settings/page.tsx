
import { PageHeader } from "@/components/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Settings" 
        description="Manage your application settings."
        icon={SettingsIcon}
      />
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <p className="text-card-foreground">This is the settings page. Configure your preferences here.</p>
        {/* More settings content will go here */}
      </div>
    </div>
  );
}
