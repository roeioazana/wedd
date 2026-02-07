import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import InvitationPage from "../pages/InvitationPage";
import EditPage from "../pages/EditPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/w/:id" element={<InvitationPage />} />
      <Route path="/edit" element={<EditPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
