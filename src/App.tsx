import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ThemeProvider } from "@/components/theme-provider";

import "./App.css";
import Preview from "./Preview";


import ResumePage from "./resume/Resume";


import Navbar from "./Navbar";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar  />
      <div className="h-[calc(100vh-5rem)] overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="h-full overflow-auto text-left">
              <ResumePage />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="h-full overflow-auto text-left">
              <Preview  />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex-none w-full h-10 bg-gray-900 text-white">
        Hello World!
      </div>
    </ThemeProvider>
  );
}

export default App;
