
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { UserManagement } from "../components/admin/UserManagement";
import { ApiUsageStats } from "../components/admin/ApiUsageStats";
import { SiteSettings } from "../components/admin/SiteSettings";
import { useToast } from "@/hooks/use-toast";

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>("dashboard");
  const { toast } = useToast();
  const [checkingRole, setCheckingRole] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        // Log to help debug
        console.log('Checking admin status for user:', user.id);
        
        // Get the user role directly from the user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking admin role:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось проверить права администратора",
            variant: "destructive",
          });
          setIsAdmin(false);
        } else {
          console.log('Role data received:', data);
          // Check if any of the returned roles is 'admin'
          const hasAdminRole = data && data.length > 0 && data.some(role => role.role === 'admin');
          setIsAdmin(hasAdminRole);
          
          if (hasAdminRole) {
            toast({
              title: "Доступ администратора",
              description: "Вы вошли как администратор",
            });
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
      setCheckingRole(false);
    };

    if (user) {
      checkAdminRole();
    } else if (!loading) {
      setCheckingRole(false);
    }
  }, [user, loading, toast]);

  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    toast({
      title: "Доступ запрещен",
      description: "У вас нет прав администратора для доступа к этой странице",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === "dashboard" && <AdminDashboard />}
      {activeView === "users" && <UserManagement />}
      {activeView === "api" && <ApiUsageStats />}
      {activeView === "settings" && <SiteSettings />}
    </AdminLayout>
  );
};

export default Admin;
