import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import NoticeList from '@/pages/NoticeList';
import NoticeNew from '@/pages/NoticeNew';
import NoticeDetail from '@/pages/NoticeDetail';
import LeaveList from '@/pages/LeaveList';
import LeaveNew from '@/pages/LeaveNew';
import LeaveApprove from '@/pages/LeaveApprove';
import SurveyList from '@/pages/SurveyList';
import SurveyNew from '@/pages/SurveyNew';
import SurveyDetail from '@/pages/SurveyDetail';
import SurveyResults from '@/pages/SurveyResults';
import ChatList from '@/pages/ChatList';
import ChatWindow from '@/pages/ChatWindow';
import StudentList from '@/pages/StudentList';
import StudentDetail from '@/pages/StudentDetail';
import GroupList from '@/pages/GroupList';
import GroupMessage from '@/pages/GroupMessage';
import Profile from '@/pages/Profile';

const AppLayout = () => {
  const { currentUser, isInitialized, init } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notices" element={<NoticeList />} />
            <Route path="/notices/new" element={<NoticeNew />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/leaves" element={<LeaveList />} />
            <Route path="/leaves/new" element={<LeaveNew />} />
            <Route path="/leaves/:id/approve" element={<LeaveApprove />} />
            <Route path="/surveys" element={<SurveyList />} />
            <Route path="/surveys/new" element={<SurveyNew />} />
            <Route path="/surveys/:id" element={<SurveyDetail />} />
            <Route path="/surveys/:id/results" element={<SurveyResults />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/chats/:id" element={<ChatWindow />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/groups/message" element={<GroupMessage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
};
