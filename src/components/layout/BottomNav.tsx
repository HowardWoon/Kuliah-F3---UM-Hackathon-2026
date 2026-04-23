import {Link, useLocation} from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const getClassName = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return "flex flex-col items-center justify-center text-on-primary-container bg-primary-container/20 rounded-xl px-4 py-1 scale-95 transition-all duration-300";
    }
    return "flex flex-col items-center justify-center text-outline px-4 py-1 hover:text-primary transition-colors";
  };

  const getIconStyle = (path: string) => {
    return location.pathname === path ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-surface-container-lowest/90 backdrop-blur-md rounded-t-[32px] border-t border-transparent shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <Link to="/" className={getClassName("/")}>
        <span className="material-symbols-outlined mb-1" style={getIconStyle("/")}>dashboard</span>
        <span className="font-label-sm text-label-sm">Home</span>
      </Link>
      <Link to="/inventory" className={getClassName("/inventory")}>
        <span className="material-symbols-outlined mb-1" style={getIconStyle("/inventory")}>kitchen</span>
        <span className="font-label-sm text-label-sm">Inventory</span>
      </Link>
      <Link to="/recipes" className={getClassName("/recipes")}>
        <span className="material-symbols-outlined mb-1" style={getIconStyle("/recipes")}>restaurant_menu</span>
        <span className="font-label-sm text-label-sm">Recipes</span>
      </Link>
      <Link to="/profile" className={getClassName("/profile")}>
        <span className="material-symbols-outlined mb-1" style={getIconStyle("/profile")}>military_tech</span>
        <span className="font-label-sm text-label-sm">Impact & Rank</span>
      </Link>
    </nav>
  );
}
