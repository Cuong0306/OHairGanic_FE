import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - accept any username/password
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("adminUsername", username);
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${username}!`,
      });
      setLocation("/");
    } else {
      toast({
        title: "Lỗi đăng nhập",
        description: "Vui lòng nhập tên đăng nhập và mật khẩu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Admin Dashboard</CardTitle>
          <CardDescription>Đăng nhập để quản lý hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                data-testid="input-username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              data-testid="button-login"
            >
              Đăng nhập
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo: Nhập bất kỳ tên đăng nhập và mật khẩu
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
