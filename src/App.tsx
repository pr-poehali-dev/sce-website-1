import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Импорт страниц
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

// Импорт страниц администратора
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Objects from "./pages/admin/Objects";
import CreateObject from "./pages/admin/CreateObject";
import Posts from "./pages/admin/Posts";
import CreatePost from "./pages/admin/CreatePost";
import Users from "./pages/admin/Users";

// Импорт страниц объектов и постов
import ObjectsList from "./pages/objects/ObjectsList";
import ObjectDetail from "./pages/objects/ObjectDetail";
import PostsList from "./pages/posts/PostsList";
import PostDetail from "./pages/posts/PostDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Маршруты объектов */}
            <Route path="/objects" element={<ObjectsList />} />
            <Route path="/objects/:id" element={<ObjectDetail />} />

            {/* Маршруты постов */}
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* Административные маршруты */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="objects" element={<Objects />} />
              <Route path="objects/create" element={<CreateObject />} />
              <Route path="posts" element={<Posts />} />
              <Route path="posts/create" element={<CreatePost />} />
              <Route path="users" element={<Users />} />
            </Route>

            {/* Маршрут 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
