import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from 'react';
import { Download, File, LayoutTemplate, Play, Save } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import "./App.css";
import { Textarea } from "@/components/ui/textarea"
import Preview from "./Preview";
//import { TypstDocument } from "@myriaddreamin/typst.react/TypstDocument";

// TypstDocument.setWasmModuleInitOptions({
//   beforeBuild: [],
//   getModule: () =>
//     'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm',
// });

function App() {
  
  const [content, setContent] = useState<string>();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        console.log(text);
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleSaveClick = async () => {
    try {
      const opts = {
        types: [
          {
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
      };
      // Show the file save dialog
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
      // Write the content to the file
      await writable.write(content);
      // Close the file and write the contents to disk.
      await writable.close();
    } catch (err) {
      console.error('Error saving file:', err);
    }
  };


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="full flex flex-col">
        <div className="flex-none h-10 mr-1 mb-1 ml-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="mr-5 text-xl font-bold">Fast CV</h1>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button variant="outline" className="group" onClick={handleButtonClick}>
              <File className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Open</span>
            </Button>
            <Button variant="outline" className="group" onClick={handleSaveClick}>
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
            <Button variant="secondary" className="group" onClick={()=> exportPdf}>
              <Download className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Download PDF</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div> hello world!</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <Preview />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="flex-none h-10 bg-gray-900"></div>
      </div>
    </ThemeProvider>
  );
}

export default App;
