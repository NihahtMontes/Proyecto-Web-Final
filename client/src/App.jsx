import ProtectedRoute from "./components/ui/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute
      allowedRoles={["admin"]}
    >
      <h1>Dashboard Admin</h1>
    </ProtectedRoute>
  );
}

export default App;