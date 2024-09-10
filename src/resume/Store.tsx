import { atom } from 'jotai';


export const emptyEducation = { 
    institution: '', 
    result: '', 
    description: '', 
    startDate:'',
    endDate:'',
    selected: true 
}

export const emptyExperience = {
    company: '', 
    position: '', 
    responsibilities: [{ text: '', selected: true }], 
    selected: true 
}

export const emptyAchievement = {
    competition: '', 
    position: '', 
    date: '',
    selected: true 
}


export const educationData = atom([{...emptyEducation}])
export  const experienceData = atom([{...emptyExperience}])
export  const achievementData = atom([{...emptyAchievement}])
