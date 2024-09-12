import { useEffect, useRef, useState } from "react";
import { Download, File, LayoutTemplate, Play, Save } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import "./App.css";
import { Textarea } from "@/components/ui/textarea";
import { educationData, experienceData, achievementData } from "./resume/Store";
import { useAtom } from "jotai";

function Preview() {
  const [education] = useAtom(educationData);
  const [achievement] = useAtom(achievementData);
  const [experience] = useAtom(experienceData);

  const [inputValue, setInputValue] = useState("Hello, World!");
  const contentDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    let eduData = "";
    education.forEach((edu) => {
      const oneData = `#edu(
  institution: "${edu.institution}",
  location: "${edu.result}",
  dates: dates-helper(start-date: "${edu.startDate}", end-date: "${edu.endDate}"),
)`;
      if (edu.selected) eduData += oneData + "\n\n";
    });
    console.log(eduData);
    const template = e.target.value;
    previewSvg(template.replace(`{{education}}`, eduData));
  };
  /*
  export const emptyExperience = {
    company: '', 
    position: '', 
    responsibilities: [{ text: '', selected: true }], 
    selected: true 
}
    */
   /*
   == Work Experience
#work(
  title: "Subatomic Shepherd and Caffeine Connoisseur",
  location: "Atomville, CA",
  company: "Microscopic Circus, Schrodinger's University",
  dates: dates-helper(start-date: "May 2024", end-date: "Present"),
)
- Played God with tiny molecules, making them dance to uncover the secrets of the universe
- Convinced high-performance computers to work overtime without unions, reducing simulation time by 50%
- Wowed a room full of nerds with pretty pictures of invisible things and imaginary findings
*/

  const renderExperience = (experiences) => {
    let expData = "";
    experiences.forEach((experience) => {
      let oneData = `#work(
          company: "${experience.company}",
          title: "${experience.position}",
          dates: dates-helper(start-date: "", end-date: ""),
        )\n`;
        for (let i = 0; i < experience.responsibilities.length; i++) {
          if (experience.responsibilities[i].selected) {
            oneData += `- ${experience.responsibilities[i].text}\n`
            ;
          }
        }
      if (experience.selected) expData += oneData + "\n\n";
    });
    
    return expData;
  }

  const renderEducation = (education) => {
    let eduData = "";
    education.forEach((edu) => {
      const oneData = `#edu(
          institution: "${edu.institution}",
          location: "${edu.result}",
          degree: "${edu.description}",
          dates: dates-helper(start-date: "${edu.startDate}", end-date: "${edu.endDate}"),
        )`;
      if (edu.selected) eduData += oneData + "\n\n";
    });
    return eduData;
  }

  const renderAchievement = (achievement) => {
    let achievementData = "";
    achievement.forEach((ach) => {
      const oneData = `#extracurriculars(
          activity: "${ach.competition}",
          dates: dates-helper(start-date: "${ach.date}", end-date: ""),
        )`;
      if (ach.selected) achievementData += oneData + "\n\n";
    });
    return achievementData;
  }

  useEffect(() => {
    
    let template = inputValue;
    template = template.replace(`{{education}}`, renderEducation(education));
    template = template.replace(`{{achievement}}`, renderAchievement(achievement));
    template = template.replace(`{{experience}}`, renderExperience(experience));
    previewSvg(template);
  }, [achievement, education,experience]);

  const previewSvg = (mainContent) => {
    if (typeof $typst !== "undefined") {
      $typst.svg({ mainContent }).then((svg: string) => {
        if (contentDivRef.current) {
          contentDivRef.current.innerHTML = svg;

          const svgElem = contentDivRef.current.firstElementChild as SVGElement;
          const width = Number.parseFloat(svgElem.getAttribute("width") || "0");
          const height = Number.parseFloat(
            svgElem.getAttribute("height") || "0"
          );
          const cw = contentDivRef.current.clientWidth;
          svgElem.setAttribute("width", cw.toString());
          svgElem.setAttribute("height", ((height * cw) / width).toString());
        } else {
          console.log("contentDivRef.current is null");
        }
      });
    } else {
      console.log("typst not loaded");
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
        onChange={(e) => handleChange(e)}
      />
      <div className="content" ref={contentDivRef}></div>
    </div>
  );
}

export default Preview;
