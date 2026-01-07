import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { VideoOverviewPage } from './pages/VideoOverviewPage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { CertificationPage } from './pages/CertificationPage';
import { CertificationCatalogPage } from './pages/CertificationCatalogPage';
import { CertificationModePage } from './pages/CertificationModePage';
import { ExamRushPage } from './pages/ExamRushPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { TutorPage } from './pages/TutorPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/videos/:id" element={<VideoOverviewPage />} />
                  <Route
                    path="/videos/:id/player"
                    element={<VideoPlayerPage />}
                  />
                  <Route
                    path="/exams/:code/topics/:topicId"
                    element={<TutorPage />}
                  />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route
                    path="/certification"
                    element={<CertificationCatalogPage />}
                  />
                  <Route
                    path="/certification/:examCode/modes"
                    element={<CertificationModePage />}
                  />
                  <Route
                    path="/certification/:examCode/exam-rush"
                    element={<ExamRushPage />}
                  />
                  <Route
                    path="/certification/:examCode"
                    element={<CertificationPage />}
                  />
                  <Route path="/ai-mentor" element={<AIMentorPage />} />
                  <Route
                    path="/exams/:code/topics/:topicId"
                    element={<TutorPage />}
                  />
                  <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

