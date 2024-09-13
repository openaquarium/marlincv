import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import "./App.css";
import { Textarea } from "@/components/ui/textarea";
import { profileData, educationData, experienceData, achievementData, templateData, renderTimeData, downloadData } from "./resume/Store";
import { useAtom } from "jotai";

/*
#let name = "Mohammad Tamimul Ehsan"
#let location = "Dhaka, Bangladesh"
#let email = "**@gmail.com"
#let github = "github.com/tamimehsan"
#let linkedin = "linkedin.com/in/tamimehsan"
#let phone = "+1 (xxx) xxx-xxxx"
#let personal-site = "tamimehsan.github.io"

*/

const renderProfile = (profile) => {
  let profileData = "";
  profileData = `
#let name = "${profile.name}"
#let location = "${profile.location}"
#let email = "${profile.email}"
#let github = "${profile.github}"
#let linkedin = "${profile.linkedin}"
#let phone = "${profile.phone}"
#let personal-site = "${profile.portfolio}"
      `;
  return profileData;
}

/*
* #work(company: "", dates: "", location: "", title: "")
*/
const renderExperience = (experiences) => {
  let expData = "";
  experiences.forEach((experience) => {
    if (!experience.selected) return;
    let duration = `dates-helper(start-date: "${experience.startDate}", end-date: "${experience.endDate}")`;
    if (experience.isCurrent) duration = `dates-helper(start-date: "${experience.startDate}", end-date: "Present")`;
    let oneData = `#work(
        title: "${experience.company}",
        dates: "${experience.location}",
        location: ${duration},
        company: "${experience.position}",
      )\n`;
    for (const responsibility of experience.responsibilities) {
      if (responsibility.selected) {
        oneData += `- ${responsibility.text}\n`;
      }
    }
    expData += oneData + "\n\n";
  });

  return expData;
}


const renderEducation = (education) => {
  let eduData = "";
  education.forEach((edu) => {
    if (!edu.selected) return;
    let duration = `dates-helper(start-date: "${edu.startDate}", end-date: "${edu.endDate}")`;
    if (edu.isCurrent) duration = `dates-helper(start-date: "${edu.startDate}", end-date: "Present")`;
    let oneData = `#edu(
        institution: "${edu.institution}",
        location: "${edu.location}",
        degree: "${edu.degree} - Result: ${edu.result}",
        dates: ${duration},
      )\n`;
    for (const responsibility of edu.responsibilities) {
      if (responsibility.selected) {
        oneData += `- ${responsibility.text}\n`;
      }
    }
    eduData += oneData + "\n\n";
  });
  return eduData;
}

const renderAchievement = (achievements) => {
  let achievementData = "";
  achievements.forEach((achievement) => {
    const oneData = `#extracurriculars(
        activity: "${achievement.competition}",
        dates: dates-helper(start-date: "${achievement.date}", end-date: ""),
      )`;
    if (achievement.selected) achievementData += oneData + "\n\n";
  });
  return achievementData;
}



const Preview = () => {
  const [profile] = useAtom(profileData);
  const [education] = useAtom(educationData);
  const [achievement] = useAtom(achievementData);
  const [experience] = useAtom(experienceData);
  const [template] = useAtom(templateData);
  const [renderTime] = useAtom(renderTimeData);
  const [download] = useAtom(downloadData);

  const contentDivRef = useRef<HTMLDivElement>(null);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  //   let eduData = "";
  //   education.forEach((edu) => {
  //     const oneData = `#edu(
  //       institution: "${edu.institution}",
  //       location: "${edu.result}",
  //       dates: dates-helper(start-date: "${edu.startDate}", end-date: "${edu.endDate}"),
  //     )`;
  //     if (edu.selected) eduData += oneData + "\n\n";
  //   });
  //   console.log(eduData);
  //   const template = e.target.value;
  //   previewSvg(template.replace(`{{education}}`, eduData));
  // };

  // useImperativeHandle(ref, () => ({
  //   renderResume() {
  //     let changedTemplate = template;
  //     changedTemplate = changedTemplate.replace(`{{education}}`, renderEducation(education));
  //     changedTemplate = changedTemplate.replace(`{{achievement}}`, renderAchievement(achievement));
  //     changedTemplate = changedTemplate.replace(`{{experience}}`, renderExperience(experience));
  //     // previewSvg(changedTemplate);
  //   }, exportPdf() {
  //     let changedTemplate = template;
  //     changedTemplate = changedTemplate.replace(`{{education}}`, renderEducation(education));
  //     changedTemplate = changedTemplate.replace(`{{achievement}}`, renderAchievement(achievement));
  //     changedTemplate = changedTemplate.replace(`{{experience}}`, renderExperience(experience));
  //     // exportPdf(template);
  //   }
  // }));

  const renderResume = () => {

    let changedTemplate = template;
    changedTemplate = changedTemplate.replace(`{{profile}}`, renderProfile(profile));
    changedTemplate = changedTemplate.replace(`{{education}}`, renderEducation(education));
    changedTemplate = changedTemplate.replace(`{{achievement}}`, renderAchievement(achievement));
    changedTemplate = changedTemplate.replace(`{{experience}}`, renderExperience(experience));
   
    previewSvg(changedTemplate);
  };

  const exportPDF = () => {
    let changedTemplate = template;
    changedTemplate = changedTemplate.replace(`{{profile}}`, renderProfile(profile));
    changedTemplate = changedTemplate.replace(`{{education}}`, renderEducation(education));
    changedTemplate = changedTemplate.replace(`{{achievement}}`, renderAchievement(achievement));
    changedTemplate = changedTemplate.replace(`{{experience}}`, renderExperience(experience));
   
    exportPdf(changedTemplate);
  };


  useEffect(() => {
    if (renderTime > 0) renderResume();
  }, [renderTime]);

  useEffect(() => {
    if (download > 0) exportPDF();
  }, [download]);

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
    } else {
      console.log('typst not loaded');
    }
  };

  return (
    <div>
      {/* <Textarea
        height="100px"
        placeholder="Type your message here."
        className="full"
        id="input"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => handleChange(e)}
      /> */}
      <div className="content" ref={contentDivRef}></div>
    </div>
  );
};

export default Preview;
