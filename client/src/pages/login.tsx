import * as React from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Facebook, Lock } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await login(values.email, values.password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate to dashboard after login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-6">
        <Logo className="scale-125" />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-muted-foreground rounded focus:ring-primary"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button variant="link" className="p-0 h-auto text-sm font-medium" type="button">
                  Forgot password?
                </Button>
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full" type="button">
              <Facebook className="h-4 w-4 mr-2" /> 
              Facebook
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.001 18.226c-.161.394-.365.773-.607 1.107-1.081 1.506-2.428 2.232-3.966 2.232-1.269 0-2.227-.43-2.828-1.251-.61-.83-.9-1.828-.905-2.857-.011-1.234.365-2.227 1.095-2.913.73-.687 1.65-1.004 2.735-1.004.462 0 .915.061 1.339.172.419.107.843.307 1.258.58-.102.247-.226.572-.365.923-.14.35-.462 1.052-.968 2.023-.549-.495-1.142-.741-1.757-.741-.596 0-1.06.2-1.382.58-.328.387-.483.893-.483 1.495.005.688.2 1.285.575 1.764.37.473.884.71 1.52.71.376 0 .749-.093 1.113-.279.36-.185.682-.445.953-.773-.085-.258-.199-.58-.333-.959-.14-.376-.247-.688-.317-.923h-1.402v-1.46h3.82v1.222l-.35.048zM16.582 7.136l1.146 3.921h.075l1.146-3.921h1.741L17.979 14.3h-1.908l-2.711-7.164h1.741zm-8.284 1.206c.833 0 1.51.218 2.026.657.511.438.77 1.032.77 1.776 0 .77-.28 1.39-.843 1.852-.563.463-1.301.698-2.22.698h-1.01V16.3h-1.5V8.342h2.777zm-.355 3.583c.355 0 .635-.096.833-.28.198-.183.296-.445.296-.776a1.04 1.04 0 0 0-.312-.767c-.209-.199-.488-.296-.843-.296h-.921v2.119h.947zM1 8.342h3.905v1.4H2.5V11.4h2.015v1.342H2.5v2.157h2.526V16.3H1V8.342z" />
              </svg>
              LinkedIn
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}