
import { PageHeader } from "@/components/PageHeader";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Login" 
        description="Access your ClarityFinance account."
        icon={LogIn}
      />
      <div className="bg-card p-6 rounded-lg shadow-sm max-w-md mx-auto">
        <p className="text-card-foreground text-center">This is where the login form will go.</p>
        {/* Login form components will be added here */}
      </div>
    </div>
  );
}
