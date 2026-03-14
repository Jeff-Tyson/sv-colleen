import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, LogIn } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome, {user.username}</CardTitle>
            <CardDescription>You are logged in as <span className="font-semibold">{user.role}</span>.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setLocation("/survey")} data-testid="button-go-survey">
              Go to Survey Tracker
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(code);
      toast({ title: "Access granted", description: "Welcome aboard." });
      setLocation("/survey");
    } catch (err: any) {
      toast({ title: "Access denied", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold" data-testid="text-login-title">Crew Access</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your access code to view survey data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5" /> Access Code
          </CardTitle>
          <CardDescription>Enter your admin or viewer access code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="COLLEEN-XXXX-2026"
                required
                data-testid="input-access-code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-login-submit">
              {loading ? "Verifying..." : <><LogIn className="w-4 h-4 mr-2" /> Enter</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
