import Router from "@/routes/Router";
import { DefaultScrollToTop } from "@/lib/utils";

function App() {
  // Initial Load Logic Here

  return (
    <>
      <DefaultScrollToTop />
      <Router />
    </>
  );
}

export default App;
