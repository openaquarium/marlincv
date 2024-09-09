import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Download, File, LayoutTemplate, Play, Save } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import "./App.css";
import Sample from "./Pdf";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="full flex flex-col">
        <div className="flex-none h-10 mr-1 mb-1 ml-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="mr-5 text-xl font-bold">Fast CV</h1>
            <Button variant="outline" className="group">
              <File className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Open</span>
            </Button>
            <Button variant="outline" className="group">
              <Save className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Save</span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="group">
              <LayoutTemplate className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Template</span>
            </Button>
            <Button variant="default" className="group">
              <Play className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Render</span>
            </Button>
            <Button variant="secondary" className="group">
              <Download className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Download PDF</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>One</ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <Sample />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="flex-none h-10 bg-gray-900"></div>
      </div>
    </ThemeProvider>
  );
}

export default App;
