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
//import { TypstDocument } from "@myriaddreamin/typst.react/TypstDocument";

// TypstDocument.setWasmModuleInitOptions({
//   beforeBuild: [],
//   getModule: () =>
//     'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm',
// });

function App() {
  
  const [content, setContent] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const contentDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    const previewSvg = (mainContent: string) => {
      console.log('previewSvg', mainContent);
      if (typeof $typst !== 'undefined') {
        $typst.svg({ mainContent }).then((svg: string) => {
          if (contentDivRef.current) {
            console.log(`rendered! SvgElement { len: ${svg.length} }`);
            contentDivRef.current.innerHTML = svg;

            const svgElem = contentDivRef.current.firstElementChild as SVGElement;
            const width = Number.parseFloat(svgElem.getAttribute('width') || '0');
            const height = Number.parseFloat(svgElem.getAttribute('height') || '0');
            const cw = document.body.clientWidth - 40;
            svgElem.setAttribute('width', cw.toString());
            svgElem.setAttribute('height', ((height * cw) / width).toString());
            console.log(`width: ${width}, height: ${height}, cw: ${cw}`);
          }else{
            console.log('contentDivRef.current is null');
          }
        });
      }
    };

    const exportPdf = (mainContent: string) => {
      if (typeof $typst !== 'undefined') {
        $typst.pdf({ mainContent }).then((pdfData: BlobPart) => {
          const pdfFile = new Blob([pdfData], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfFile);
          link.target = '_blank';
          link.click();
          URL.revokeObjectURL(link.href);
        });
      }
    };

    const initializeTypst = () => {
      //if (typeof $typst !== 'undefined') {
        $typst.setCompilerInitOptions({
          getModule: () =>
            'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm',
        });
        $typst.setRendererInitOptions({
          getModule: () =>
            'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm',
        });

        if (inputRef.current) {
          inputRef.current.oninput = () => {
            if (inputRef.current) {
              console.log(inputRef.current.value);
              previewSvg(inputRef.current.value || '');
              inputRef.current.style.height = '5px';
              inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
            }
          };
          previewSvg(inputRef.current.value);
        }
      }
    //  };

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js';
    script.id = 'typst';
    script.onload = initializeTypst;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);



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
            <Button variant="secondary" className="group">
              <Download className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
              <span>Download PDF</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <Textarea 
              placeholder="Type your message here." 
              className="full" 
              id="input" 
              ref={inputRef}
              value={inputValue}
              onInput={(e) => {
                setInputValue(e.currentTarget.value);
              
              }
              }/>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <div id="content" ref={contentDivRef}></div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="flex-none h-10 bg-gray-900"></div>
      </div>
    </ThemeProvider>
  );
}

export default App;
