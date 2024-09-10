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

import { atom, useAtom } from 'jotai';
import ResumePage from "./resume/Resume";


import { educationData, experienceData, achievementData } from "./resume/Store";
 

function App() {

  const [education, setEducation] = useAtom(educationData)
  const [experience, setExperience] = useAtom(experienceData)
  const [achievement, setAchievements] = useAtom(achievementData)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;

        const resumeData = JSON.parse(text);
        setEducation(resumeData.education);
        setExperience(resumeData.experience);
        setAchievements(resumeData.achievement);
        console.log(resumeData.education);
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
      const resumeData = {
        experience,
        achievement,
        education
      }
      await writable.write(JSON.stringify(resumeData));
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
              <ResumePage />
            </ResizablePanel>
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
