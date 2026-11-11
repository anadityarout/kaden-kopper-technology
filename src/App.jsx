import MainApp from "./Main/src/App";
import AdminApp from "./Admin/src/App";

function App() {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return <AdminApp />;
  }

  return <MainApp />;
}

export default App;