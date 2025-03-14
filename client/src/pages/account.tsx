import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Loader2, CreditCard, Save, Lock } from "lucide-react";

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    marketingEmails: true,
    notificationEmails: true,
  });

  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear password error when user starts typing
    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsChangingPassword(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Current Plan</h3>
                    <Badge variant={user?.isPremium ? "default" : "secondary"}>
                      {user?.isPremium ? user.subscriptionTier : "Free Plan"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      {user?.isPremium 
                        ? "You're on a premium plan with advanced features." 
                        : "You're on the free plan with basic features. Upgrade for more capabilities."}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Billing Information</h3>
                  <Separator />
                  <div className="pt-2">
                    {user?.isPremium ? (
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span>•••• •••• •••• 4242</span>
                        <Badge variant="outline">Expires 12/25</Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No payment method on file.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Usage</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium">Listings Generated</p>
                      <p className="text-2xl font-bold">12 / {user?.isPremium ? "∞" : "5"}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Compliance Checks</p>
                      <p className="text-2xl font-bold">12 / {user?.isPremium ? "∞" : "5"}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={user?.isPremium ? "outline" : "default"}>
                  {user?.isPremium ? "Manage Subscription" : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleNotificationSubmit}>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketingEmails" className="flex-1">Marketing emails</Label>
                    <Switch
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, marketingEmails: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notificationEmails" className="flex-1">Notification emails</Label>
                    <Switch
                      id="notificationEmails"
                      name="notificationEmails"
                      checked={formData.notificationEmails}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, notificationEmails: checked })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  {!isChangingPassword ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        {passwordError && (
                          <p className="text-sm text-red-500">{passwordError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                {isChangingPassword && (
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordError("");
                        setFormData({
                          ...formData,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 