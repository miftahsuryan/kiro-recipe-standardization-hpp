import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IngredientManagementPage } from '../features/ingredients/IngredientManagementPage';

const queryClient = new QueryClient();

function NavBar() {
  return (
    <header className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🍳</span>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              Standar Resep
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1" aria-label="Navigasi utama">
            <NavLink
              to="/ingredients"
              className={({ isActive }) =>
                [
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              Bahan Baku
            </NavLink>
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                [
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              Resep
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/ingredients" replace />} />
          <Route path="/ingredients" element={<IngredientManagementPage />} />
          <Route
            path="/recipes"
            element={
              <div className="p-8 text-gray-500 text-center">
                Halaman Daftar Resep (segera hadir)
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
