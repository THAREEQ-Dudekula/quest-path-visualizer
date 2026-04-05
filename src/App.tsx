import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import Learning from "./pages/Learning";
import Lesson from "./pages/Lesson";
import Challenge from "./pages/Challenge";
import Quiz from "./pages/Quiz";
import Compare from "./pages/Compare";
import Progress from "./pages/Progress";
import CodingLab from "./pages/CodingLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:id" element={<Lesson />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/coding-lab" element={<CodingLab />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
