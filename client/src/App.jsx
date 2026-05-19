import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Circulars from './pages/Circulars';
import Activities from './pages/Activities';
import MyInfo from './pages/MyInfo';
import Schedule from './pages/Schedule';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UserManagement from './pages/admin/UserManagement';
import ApprovalRequests from './pages/admin/ApprovalRequests';
import RequestCircular from './pages/teacher/RequestCircular';
import TeacherAttendance from './pages/teacher/TeacherAttendance';

// Layout component to wrap protected content
const Layout = ({ children }) => {
  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans antialiased flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        <div 
          id="main-content" 
          className="relative w-full h-full overflow-y-auto bg-transparent min-h-[calc(100vh-64px)] ml-0"
        >
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full page-fade-enter">
            {children}
          </div>
        </div>
      </div>
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none overflow-hidden bg-[#020617]">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              {user?.role === 'admin' ? <AdminDashboard /> : 
               user?.role === 'teacher' ? <TeacherDashboard /> : 
               <Dashboard />}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/requests" 
        element={
          <ProtectedRoute>
            <Layout>
              <ApprovalRequests />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/request-circular" 
        element={
          <ProtectedRoute>
            <Layout>
              <RequestCircular />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <Layout>
              {user?.role === 'teacher' ? <TeacherAttendance /> : <Attendance />}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/schedule" 
        element={
          <ProtectedRoute>
            <Layout>
              <Schedule />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/marks" 
        element={
          <ProtectedRoute>
            <Layout>
              <Marks />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/circulars" 
        element={
          <ProtectedRoute>
            <Layout>
              <Circulars />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activities" 
        element={
          <ProtectedRoute>
            <Layout>
              <Activities />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <MyInfo />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
