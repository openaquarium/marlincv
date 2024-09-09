import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import "./App.css";
import Sample from "./Pdf";

function App() {
  return (
    <div className="full flex flex-col">
      <div className="flex-none h-10 bg-gray-400"></div>
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
  );
}

export default App;
