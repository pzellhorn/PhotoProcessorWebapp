import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import GalleryPage from "./pages/GalleryPage";
import PhotoPage from "./pages/PhotoPage";
import PeoplePage from "./pages/PeoplePage";
import PersonPage from "./pages/PersonPage";
import ProgressPage from "./pages/ProgressPage";

export default function App() {
    return (
        <div className="app">
            <header className="app-header">
                <span className="app-title">PhotoProcessor</span>
                <nav>
                    <NavLink to="/photos">Photos</NavLink>
                    <NavLink to="/people">People</NavLink>
                    <NavLink to="/progress">Progress</NavLink>
                </nav>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Navigate to="/photos" replace />} />
                    <Route path="/photos" element={<GalleryPage />} />
                    <Route path="/photos/:mediaId" element={<PhotoPage />} />
                    <Route path="/people" element={<PeoplePage />} />
                    <Route path="/people/:tagId" element={<PersonPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="*" element={<Navigate to="/photos" replace />} />
                </Routes>
            </main>
        </div>
    );
}
