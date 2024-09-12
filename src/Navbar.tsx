import { useEffect, useRef } from "react";
import { Download, File, LayoutTemplate, Play, Save } from "lucide-react";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { useAtom } from "jotai";

import { educationData, experienceData, achievementData, templateData, renderTimeData, downloadData } from "./resume/Store";


export default function Navbar() {
  
  const [education, setEducation] = useAtom(educationData);
  const [experience, setExperience] = useAtom(experienceData);
  const [achievement, setAchievements] = useAtom(achievementData);
  const [template, setTemplate] = useAtom(templateData);
  const [renderTime, setRenderTime] = useAtom(renderTimeData);
  const [download, setDownload] = useAtom(downloadData);

  const childRef = useRef(null);

  

   useEffect(() => {
    fetch("/templates/stephen.typ")
      .then((response) => response.text())
      .then((text) => {
        setTemplate(text);
      });
  }, []);

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
    document.getElementById("fileInput")?.click();
  };

  const handleSaveClick = async () => {
    try {
      const opts = {
        types: [
          {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
          },
        ],
      } as SaveFilePickerOptions;
      // Show the file save dialog
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
      // Write the content to the file
      const resumeData = {
        experience,
        achievement,
        education,
      };
      await writable.write(JSON.stringify(resumeData));
      // Close the file and write the contents to disk.
      await writable.close();
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };



  const handleRenderClick = () => {
    setRenderTime((prev) => prev + 1);
  };

  const handleExportClick = () => {
    setDownload((prev) => prev + 1);
  }

  return (
    <div className="h-10 mx-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h1 className="mr-5 text-xl font-bold">Fast CV</h1>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="group"
        onClick={handleButtonClick}
      >
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
      <Button variant="default" className="group" onClick={handleRenderClick}>
        <Play className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
        <span>Render</span>
      </Button>
      <Button
        variant="secondary"
        className="group"
        onClick={handleExportClick}
      >
        <Download className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
        <span>Download PDF</span>
      </Button>
      <ModeToggle />
    </div>
  </div>
  )
}
