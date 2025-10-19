import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { authApi } from "@/lib/APIs/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await authApi.login({ email, password });

    // ✅ Lưu token và cờ đăng nhập
    localStorage.setItem("access_token", res.token);
    localStorage.setItem("isAuthenticated", "true");

    toast({
      title: "Đăng nhập thành công",
      description: `Chào mừng ${email}!`,
    });

    // ✅ Chuyển sang trang admin dashboard
    setLocation("/");
  } catch (err: any) {
    toast({
      title: "Lỗi đăng nhập",
      description: err.message || "Sai email hoặc mật khẩu",
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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

            <Button type="submit" className="w-full" data-testid="button-login">
              Đăng nhập
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Trang quản trị hệ thống OHairGanic
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
