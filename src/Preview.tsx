import { useEffect, useRef, useState } from 'react';
import { Download, File, LayoutTemplate, Play, Save } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import "./App.css";
import { Textarea } from "@/components/ui/textarea"



function Preview() {
 
  const [inputValue, setInputValue] = useState("Hello, World!");
  const contentDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    previewSvg(e.target.value);
  }
  const previewSvg = (mainContent) => {
   
    if (typeof $typst !== 'undefined') {
      $typst.svg({ mainContent }).then((svg: string) => {
        if (contentDivRef.current) {
         
          contentDivRef.current.innerHTML = svg;

          const svgElem = contentDivRef.current.firstElementChild as SVGElement;
          const width = Number.parseFloat(svgElem.getAttribute('width') || '0');
          const height = Number.parseFloat(svgElem.getAttribute('height') || '0');
          const cw = document.body.clientWidth/2;
          svgElem.setAttribute('width', cw.toString());
          svgElem.setAttribute('height', ((height * cw) / width).toString());
        } else {
          console.log('contentDivRef.current is null');
        }
      });
    }else{
      console.log('typst not loaded');
    }
  };

  // const exportPdf = (mainContent: string) => {
  //   console.log('exportPdf', mainContent);
  //   if (typeof $typst !== 'undefined') {
  //     $typst.pdf({ mainContent }).then((pdfData: BlobPart) => {
  //       const pdfFile = new Blob([pdfData], { type: 'application/pdf' });
  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(pdfFile);
  //       link.target = '_blank';
  //       link.click();
  //       URL.revokeObjectURL(link.href);
  //     });
  //   }
  // };

  return (
    <div>
      <Textarea
        height="100px"
        placeholder="Type your message here."
        className="full"
        id="input"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => handleChange(e)} />
      <div id="content" ref={contentDivRef}></div>
    </div>
  )

}


export default Preview;