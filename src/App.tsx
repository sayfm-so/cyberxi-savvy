import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'

const Dashboard = lazy(() => import('./routes/Dashboard'))
const Journey = lazy(() => import('./routes/Journey'))
const Knowledge = lazy(() => import('./routes/Knowledge'))
const Videos = lazy(() => import('./routes/Videos'))
const Quizzes = lazy(() => import('./routes/Quizzes'))
const Challenges = lazy(() => import('./routes/Challenges'))
const Simulations = lazy(() => import('./routes/Simulations'))
const AskSavvy = lazy(() => import('./routes/AskSavvy'))
const Products = lazy(() => import('./routes/Products'))
const Certificate = lazy(() => import('./routes/Certificate'))
const Admin = lazy(() => import('./routes/Admin'))
const Reports = lazy(() => import('./routes/Reports'))
const Settings = lazy(() => import('./routes/Settings'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="ambient min-h-screen" />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="journey" element={<Journey />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="videos" element={<Videos />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="simulations" element={<Simulations />} />
            <Route path="savvy" element={<AskSavvy />} />
            <Route path="products" element={<Products />} />
            <Route path="certificate" element={<Certificate />} />
            <Route path="admin" element={<Admin />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
