import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateBlog from "./pages/CreateBlog.jsx";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogPostDetails from "./pages/BlogPostDetails";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogPostDetails />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/create-blog" element={<CreateBlog />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
