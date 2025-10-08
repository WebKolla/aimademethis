export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  // This layout overrides the root layout to exclude Navbar and Footer
  // The actual dashboard layout (with sidebar) is handled by DashboardLayout component
  return children;
}
