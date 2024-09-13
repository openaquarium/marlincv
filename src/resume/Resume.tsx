'use client'


import AchievementSection2 from './Achievemen2'
import EducationSection from './Education'
import EducationSection2 from './EducationNew'
import ExperienceSection from './Experience'
import ProfileSection from './Profile'
import ProjectSection from './Project'
import SkillSection from './Skill'


export default function ResumePage() {
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
      <ProfileSection />
      {/* <EducationSection /> */}
      <EducationSection2 />
      <ExperienceSection />
      {/* <ExperienceSection /> */}
      <ProjectSection />
      <AchievementSection2 />
      <SkillSection />

      
    </div>
  )
}