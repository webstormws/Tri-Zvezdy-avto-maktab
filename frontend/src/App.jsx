import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import Home from "./pages/Home";
import AdminLayout from "./pages/admin/AdminLayout";

const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Branches = lazy(() => import("./pages/Branches"));
const Lessons = lazy(() => import("./pages/Lessons"));
const Results = lazy(() => import("./pages/Results"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminResourcePage = lazy(() => import("./pages/admin/AdminResourcePage"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminContact = lazy(() => import("./pages/admin/AdminContact"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
    </div>
  );
}

function PublicLayout() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <MobileBottomNav />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/results" element={<Results />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<Suspense fallback={<PageLoader />}><AdminResourcePage resourceKey="courses" /></Suspense>} />
        <Route path="branches" element={<Suspense fallback={<PageLoader />}><AdminResourcePage resourceKey="branches" /></Suspense>} />
        <Route path="news" element={<Suspense fallback={<PageLoader />}><AdminResourcePage resourceKey="news" /></Suspense>} />
        <Route path="lessons" element={<Suspense fallback={<PageLoader />}><AdminResourcePage resourceKey="lessons" /></Suspense>} />
        <Route path="results" element={<Suspense fallback={<PageLoader />}><AdminResourcePage resourceKey="results" /></Suspense>} />
        <Route path="applications" element={<Suspense fallback={<PageLoader />}><AdminApplications /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<PageLoader />}><AdminContact /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
      </Route>
    </Routes>
  );
}
