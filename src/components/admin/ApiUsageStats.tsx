
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ApiRequest {
  id: string;
  user_id: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  email?: string;
}

interface DailyStats {
  date: string;
  count: number;
}

export const ApiUsageStats: React.FC = () => {
  const [apiRequests, setApiRequests] = useState<ApiRequest[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiUsage();
  }, []);

  const fetchApiUsage = async () => {
    setLoading(true);
    try {
      // Get API requests with user information
      const { data, error } = await supabase
        .from('api_requests')
        .select(`
          id,
          user_id,
          endpoint,
          method,
          status,
          timestamp,
          users:user_id(email)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform the data to include email
      const formattedData = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        endpoint: item.endpoint,
        method: item.method,
        status: item.status,
        timestamp: item.timestamp,
        email: item.users?.email || 'Unknown',
      }));

      setApiRequests(formattedData);

      // Calculate daily statistics
      const { data: statsData, error: statsError } = await supabase
        .from('api_requests')
        .select('timestamp')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (statsError) throw statsError;

      // Group by day and count
      const dailyCounts = (statsData || []).reduce((acc: {[key: string]: number}, item) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count,
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setDailyStats(chartData);
    } catch (error) {
      console.error('Error fetching API usage:', error);
      toast({
        title: "Error",
        description: "Failed to load API usage data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Requests (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No API requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.email}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{request.endpoint}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                              request.method === 'POST' ? 'bg-green-100 text-green-800' :
                              request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.method}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status >= 200 && request.status < 300 ? 'bg-green-100 text-green-800' :
                              request.status >= 400 && request.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                              request.status >= 500 ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(request.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
