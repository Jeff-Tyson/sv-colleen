import { Link, useLocation } from "wouter";
import { Moon, Sun, User, LogOut, Menu, X, Sailboat } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/survey", label: "Survey Tracker" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md" data-testid="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 no-underline" data-testid="link-home-logo">
              <svg
                viewBox="0 0 32 32"
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-label="S/V Colleen logo"
              >
                {/* Hull */}
                <path d="M4 22 C4 22 8 26 16 26 C24 26 28 22 28 22 L26 22 C26 22 22 24 16 24 C10 24 6 22 4 22Z" fill="currentColor" opacity="0.15" />
                <path d="M4 22 C4 22 8 26 16 26 C24 26 28 22 28 22" strokeLinecap="round" />
                {/* Mast */}
                <line x1="16" y1="6" x2="16" y2="24" />
                {/* Mainsail */}
                <path d="M16 6 L16 20 L24 20 Z" fill="currentColor" opacity="0.1" />
                <path d="M16 6 L24 20 L16 20" strokeLinejoin="round" />
                {/* Jib */}
                <path d="M16 8 L16 18 L10 18 Z" fill="currentColor" opacity="0.08" />
                <path d="M16 8 L10 18 L16 18" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-bold tracking-tight text-primary">S/V Colleen</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-toggle-theme"
                className="rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span data-testid="text-username">{user.username}</span>
                    <span className="text-[10px] uppercase opacity-70">({user.role})</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout} data-testid="button-logout" className="rounded-full">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block no-underline">
                  <Button variant="outline" size="sm" data-testid="button-login-nav" className="gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/60 bg-background pb-4">
            <div className="px-4 pt-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="pt-2 border-t border-border/60 mt-2 flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">{user.username} ({user.role})</span>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-1" /> Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground no-underline">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <PerplexityAttribution />
    </div>
  );
}
