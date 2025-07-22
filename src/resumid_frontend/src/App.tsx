import Router from "@/routes/Router";
import { DefaultScrollToTop } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

function App() {
  // Initial Load Logic Here

  return (
    <>
      <DefaultScrollToTop />
      <Router />
      <Toaster />
    </>
  );
}

export default App;
