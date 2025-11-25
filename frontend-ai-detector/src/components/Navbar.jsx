import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">AI Detector</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/news" className="hover:text-blue-500">News</Link>
        <Link to="/media" className="hover:text-blue-500">Media</Link>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/login" className="hover:text-blue-500">Login</Link>
      </div>
    </nav>
  );
}
