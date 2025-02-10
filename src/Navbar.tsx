import { useEffect, useRef,useState } from "react";
import { Download, File, LayoutTemplate, Play, Save,Sparkles } from "lucide-react";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { useAtom } from "jotai";
import axios from 'axios';

import { educationData, experienceData, achievementData, templateData, renderTimeData, downloadData, profileData, projectData, skillData } from "./resume/Store";


export default function Navbar() {

  const [education, setEducation] = useAtom(educationData);
  const [experience, setExperience] = useAtom(experienceData);
  const [achievement, setAchievements] = useAtom(achievementData);
  const [profile, setProfile] = useAtom(profileData);
  const [project, setProject] = useAtom(projectData);
  const [skill, setSkill] = useAtom(skillData);
  const [template, setTemplate] = useAtom(templateData);
  const [renderTime, setRenderTime] = useAtom(renderTimeData);
  const [download, setDownload] = useAtom(downloadData);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const childRef = useRef(null);



   useEffect(() => {
    fetch("./templates/stephen.typ")
      .then((response) => response.text())
      .then((text) => {
        setTemplate(text);
      });

      loadDataFromLocalStorage();



  }, []);


  useEffect(() => {
    handleRenderClick();
    saveToLocalStorage(

      {
        profile,
        experience,
        achievement,
        education,
        project,
        skill,
      }
            )


  }, [profile, experience,achievement,education,project,skill]);



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;

        const resumeData = JSON.parse(text);
        setProfile(resumeData.profile);
        setEducation(resumeData.education);
        setExperience(resumeData.experience);
        setAchievements(resumeData.achievement);
        setProject(resumeData.project);
        setSkill(resumeData.skill);
        console.log(resumeData.education);

        saveToLocalStorage(resumeData);
      };

      reader.readAsText(file);


    }
  };

  const loadDataFromLocalStorage = () => {
    try {
      // Get JSON string from localStorage
      const resumeDataString = localStorage.getItem('resumeData');

      if (resumeDataString) {
        // Parse JSON string to object
        const resumeData = JSON.parse(resumeDataString);

        // Set all the states with the data
        setProfile(resumeData.profile);
        setEducation(resumeData.education);
        setExperience(resumeData.experience);
        setAchievements(resumeData.achievement);
        setProject(resumeData.project);
        setSkill(resumeData.skill);
        console.log(resumeData.education);
        //sleep for 0.1 second the handleRenderClick
        setTimeout(() => {
          console.log("handleRender")
          handleRenderClick();
        }, 1000);


      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
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
        profile,
        experience,
        achievement,
        education,
        project,
        skill,
      };
      await writable.write(JSON.stringify(resumeData));
      // Close the file and write the contents to disk.
      await writable.close();
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  function saveToLocalStorage(resumeData) {
    try {


        const serializedData = JSON.stringify(resumeData);
        localStorage.setItem("resumeData", serializedData);
        console.log('Data successfully saved');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

  const generateAIResume = async () => {
    try {
      setLoading(true);

      // Get credentials from localStorage
      const storedCredentials = localStorage.getItem('resumeData');
      const resumeData = storedCredentials ? JSON.parse(storedCredentials) : {};

      // Create axios instance with base URL from Vite env
      const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Make POST request
      const response = await axiosInstance.post('/generateResume', {
        ...resumeData,
      });

      resumeData.experience=response.data.experience;
      resumeData.project=response.data.project;
      resumeData.skill=response.data.skill;

      // Store the response data in localStorage
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      setData(resumeData);
      loadDataFromLocalStorage()

      setError(null);

    } catch (err) {
      setError(err.message);
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }



  const handleRenderClick = () => {
    setRenderTime((prev) => prev + 1);
  };

  const handleExportClick = () => {
    setDownload((prev) => prev + 1);
  }

  return (
    <div className="h-10 mx-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h1 className="mr-5 text-xl font-bold">Marlin CV</h1>
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

      <Button
        variant="outline"
        className="group relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 hover:from-purple-500 hover:via-blue-400 hover:to-cyan-300 text-white border-none transition-all duration-300 hover:scale-[1.02]"
        onClick={generateAIResume}
        disabled={loading}
      >
        <Sparkles className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
        <span>{loading ? "Generating..." : "AI Generate"}</span>
      </Button>
    </div>
    <div className="flex items-center gap-3">
      {/* <Button variant="outline" className="group">
        <LayoutTemplate className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
        <span>Template</span>
      </Button> */}
      {/* <Button  id="renderButton" variant="default" className="group" onClick={handleRenderClick} >
        <Play className="h-[1rem] w-[1rem] scale-100 group-hover:scale-110 transition-transform mr-2" />
        <span>Render</span>
      </Button> */}
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
