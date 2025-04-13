
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Users, ActivitySquare, Clock } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalApiRequests, setTotalApiRequests] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastLogin, setLastLogin] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get total users
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;
        setTotalUsers(userCount || 0);

        // Get total API requests
        const { count: apiCount, error: apiError } = await supabase
          .from('api_requests')
          .select('*', { count: 'exact', head: true });

        if (apiError) throw apiError;
        setTotalApiRequests(apiCount || 0);

        // Get last login
        const { data: loginData, error: loginError } = await supabase
          .from('auth.users')
          .select('last_sign_in_at')
          .order('last_sign_in_at', { ascending: false })
          .limit(1)
          .single();

        if (loginError && loginError.code !== 'PGRST116') throw loginError;
        
        if (loginData && loginData.last_sign_in_at) {
          const date = new Date(loginData.last_sign_in_at);
          setLastLogin(date.toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted rounded-t-lg"></CardHeader>
              <CardContent className="h-12 mt-4 bg-muted rounded-b-lg"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <CardDescription>All registered accounts</CardDescription>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                <CardDescription>Total API calls made</CardDescription>
              </div>
              <ActivitySquare className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApiRequests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                <CardDescription>Most recent user activity</CardDescription>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">
                {lastLogin || "No logins recorded"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View, edit, and manage user accounts</p>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle>View API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Monitor API requests and usage statistics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
