'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { resumeData } from "./App";
import { useAtom } from 'jotai'

// Education Section Component
const EducationSection = ({ education, setEducation }) => {
    
  const addEducation = () => {
    setEducation([...education, { institution: '', result: '', description: '', selected: true }])
  }

  const deleteEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index)
    setEducation(newEducation)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <Card key={index}>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={edu.selected}
                    onCheckedChange={(checked) => {
                      const newEducation = [...education]
                      newEducation[index].selected = checked
                      setEducation(newEducation)
                    }}
                    id={`edu-select-${index}`}
                  />
                  <Label htmlFor={`edu-select-${index}`}>Select/Deselect</Label>
                </div>
                <Button variant="destructive" size="icon" onClick={() => deleteEducation(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`edu-institution-${index}`}>Institution Name</Label>
                <Input
                  id={`edu-institution-${index}`}
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEducation = [...education]
                    newEducation[index].institution = e.target.value
                    setEducation(newEducation)
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`edu-result-${index}`}>Result</Label>
                <Input
                  id={`edu-result-${index}`}
                  placeholder="Result"
                  value={edu.result}
                  onChange={(e) => {
                    const newEducation = [...education]
                    newEducation[index].result = e.target.value
                    setEducation(newEducation)
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`edu-description-${index}`}>Description</Label>
                <Textarea
                  id={`edu-description-${index}`}
                  placeholder="Description"
                  value={edu.description}
                  onChange={(e) => {
                    const newEducation = [...education]
                    newEducation[index].description = e.target.value
                    setEducation(newEducation)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addEducation}>
          <Plus className="mr-2 h-4 w-4" /> Add New Education
        </Button>
      </CardContent>
    </Card>
  )
}

// Experience Section Component
const ExperienceSection = ({ experience, setExperience }) => {
  const addExperience = () => {
    setExperience([...experience, { company: '', position: '', responsibilities: [], selected: true }])
  }

  const deleteExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index)
    setExperience(newExperience)
  }

  const addResponsibility = (expIndex) => {
    const newExperience = [...experience]
    newExperience[expIndex].responsibilities.push({ text: '', selected: true })
    setExperience(newExperience)
  }

  const deleteResponsibility = (expIndex, respIndex) => {
    const newExperience = [...experience]
    newExperience[expIndex].responsibilities = newExperience[expIndex].responsibilities.filter((_, i) => i !== respIndex)
    setExperience(newExperience)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newExperience = [...experience]
    const [reorderedItem] = newExperience[result.source.droppableId].responsibilities.splice(result.source.index, 1)
    newExperience[result.destination.droppableId].responsibilities.splice(result.destination.index, 0, reorderedItem)

    setExperience(newExperience)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {experience.map((exp, expIndex) => (
            <Card key={expIndex}>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={exp.selected}
                      onCheckedChange={(checked) => {
                        const newExperience = [...experience]
                        newExperience[expIndex].selected = checked
                        setExperience(newExperience)
                      }}
                      id={`exp-select-${expIndex}`}
                    />
                    <Label htmlFor={`exp-select-${expIndex}`}>Select/Deselect</Label>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => deleteExperience(expIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`exp-company-${expIndex}`}>Company Name</Label>
                  <Input
                    id={`exp-company-${expIndex}`}
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const newExperience = [...experience]
                      newExperience[expIndex].company = e.target.value
                      setExperience(newExperience)
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`exp-position-${expIndex}`}>Position</Label>
                  <Input
                    id={`exp-position-${expIndex}`}
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => {
                      const newExperience = [...experience]
                      newExperience[expIndex].position = e.target.value
                      setExperience(newExperience)
                    }}
                  />
                </div>
                <Droppable droppableId={expIndex.toString()}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {exp.responsibilities.map((resp, respIndex) => (
                        <Draggable key={respIndex} draggableId={`${expIndex}-${respIndex}`} index={respIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center space-x-2"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="text-gray-400" />
                              </div>
                              <Checkbox
                                checked={resp.selected}
                                onCheckedChange={(checked) => {
                                  const newExperience = [...experience]
                                  newExperience[expIndex].responsibilities[respIndex].selected = checked
                                  setExperience(newExperience)
                                }}
                                id={`resp-select-${expIndex}-${respIndex}`}
                              />
                              <Input
                                placeholder="Responsibility"
                                value={resp.text}
                                onChange={(e) => {
                                  const newExperience = [...experience]
                                  newExperience[expIndex].responsibilities[respIndex].text = e.target.value
                                  setExperience(newExperience)
                                }}
                              />
                              <Button variant="destructive" size="icon" onClick={() => deleteResponsibility(expIndex, respIndex)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Button onClick={() => addResponsibility(expIndex)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Responsibility
                </Button>
              </CardContent>
            </Card>
          ))}
        </DragDropContext>
        <Button onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" /> Add New Experience
        </Button>
      </CardContent>
    </Card>
  )
}

// Achievements Section Component
const AchievementsSection = ({ achievements, setAchievements }) => {
    
  const addAchievement = () => {
    setAchievements([...achievements, { competition: '', position: '', selected: true }])
  }

  const deleteAchievement = (index) => {
    const newAchievements = achievements.filter((_, i) => i !== index)
    setAchievements(newAchievements)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newAchievements = Array.from(achievements)
    const [reorderedItem] = newAchievements.splice(result.source.index, 1)
    newAchievements.splice(result.destination.index, 0, reorderedItem)

    setAchievements(newAchievements)

    console.log(newAchievements)

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="achievements">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {achievements.map((achievement, index) => (
                  <Draggable key={index} draggableId={`achievement-${index}`} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <CardContent className="flex items-center space-x-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="text-gray-400" />
                          </div>
                          <Checkbox
                            checked={achievement.selected}
                            onCheckedChange={(checked) => {
                              const newAchievements = [...achievements]
                              newAchievements[index].selected = checked
                              setAchievements(newAchievements)
                            }}
                            id={`achievement-select-${index}`}
                          />
                          <div className="flex-grow space-y-1">
                            <Label htmlFor={`achievement-competition-${index}`}>Competition Name</Label>
                            <Input
                              id={`achievement-competition-${index}`}
                              placeholder="Competition Name"
                              value={achievement.competition}
                              onChange={(e) => {
                                const newAchievements = [...achievements]
                                newAchievements[index].competition = e.target.value
                                setAchievements(newAchievements)
                              }}
                            />
                          </div>
                          <div className="flex-grow space-y-1">
                            <Label htmlFor={`achievement-position-${index}`}>Position</Label>
                            <Input
                              id={`achievement-position-${index}`}
                              placeholder="Position"
                              value={achievement.position}
                              onChange={(e) => {
                                const newAchievements = [...achievements]
                                newAchievements[index].position = e.target.value
                                setAchievements(newAchievements)
                              }}
                            />
                          </div>
                          <Button variant="destructive" size="icon" onClick={() => deleteAchievement(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={addAchievement}>
          <Plus className="mr-2 h-4 w-4" /> Add New Achievement
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ResumePage() {
  const [education, setEducation] = useState([{ institution: '', result: '', description: '', selected: true }])
  const [experience, setExperience] = useState([{ company: '', position: '', responsibilities: [{ text: '', selected: true }], selected: true }])
  const [achievements, setAchievements] = useState([{ competition: '', position: '', selected: true }])
  
  const [resume, setResume] = useAtom(resumeData);

  useEffect(() => {
    setResume({
      education,
      experience,
      achievements
    })
  }, [education, experience, achievements]);
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
      <EducationSection education={education} setEducation={setEducation} />
      <ExperienceSection experience={experience} setExperience={setExperience} />
      <AchievementsSection achievements={achievements} setAchievements={setAchievements} />
    </div>
  )
}