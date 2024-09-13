'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2,ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { experienceData, getEmptyExperience } from './Store'
import { useAtom } from 'jotai'
import { Textarea } from '@/components/ui/textarea'

// Types
type Responsibility = {
  id: string
  text: string
  selected: boolean
}

type Experience = {
  id: string
  company: string
  position: string
  responsibilities: Responsibility[]
  selected: boolean
}

// Custom hook for drag and drop logic
const useDragAndDrop = (experience: Experience[], setExperience: React.Dispatch<React.SetStateAction<Experience[]>>) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'experience') {
      const newExperience = Array.from(experience)
      const [reorderedItem] = newExperience.splice(source.index, 1)
      newExperience.splice(destination.index, 0, reorderedItem)
      setExperience(newExperience)
    } else if (type === 'responsibility') {
      const newExperience = [...experience]
      const sourceExp = newExperience[parseInt(source.droppableId)]
      const [reorderedItem] = sourceExp.responsibilities.splice(source.index, 1)
      const destExp = newExperience[parseInt(destination.droppableId)]
      destExp.responsibilities.splice(destination.index, 0, reorderedItem)
      setExperience(newExperience)
    }
  }

  return { onDragEnd }
}

// Responsibility Item Component
const ResponsibilityItem = ({ expIndex, resp, index, updateResponsibility, deleteResponsibility }) => {
  return (
    <Draggable draggableId={`${expIndex}-${resp.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex items-center space-x-2 mb-2"
        >
          <div {...provided.dragHandleProps}>
            <GripVertical className="text-gray-400" />
          </div>
          <Checkbox
            checked={resp.selected}
            onCheckedChange={(checked) => updateResponsibility(expIndex, index, { ...resp, selected: checked })}
            id={`resp-select-${expIndex}-${index}`}
          />
          <Textarea
            placeholder="Responsibility"
            value={resp.text}
            onChange={(e) => updateResponsibility(expIndex, index, { ...resp, text: e.target.value })}
          />
          <Button variant="destructive" size="icon" onClick={() => deleteResponsibility(expIndex, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  )
}

// Experience Entry Component
const ExperienceEntry = ({ exp, index, updateExperience, deleteExperience, addResponsibility, updateResponsibility, deleteResponsibility }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <Draggable draggableId={exp.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="text-gray-400" />
                  </div>
                  <Checkbox
                    checked={exp.selected}
                    onCheckedChange={(checked) => updateExperience(index, { ...exp, selected: checked })}
                    id={`exp-select-${index}`}
                  />
                  <Label > {exp.company || 'Company Name'} | {exp.position} </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isCollapsed && (
              <>
              <div className="space-y-1">
                <Label htmlFor={`exp-company-${index}`}>Company Name</Label>
                <Input
                  id={`exp-company-${index}`}
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, { ...exp, company: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`exp-position-${index}`}>Position</Label>
                <Input
                  id={`exp-position-${index}`}
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, { ...exp, position: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`exp-location-${index}`}>Location</Label>
                <Input
                  id={`exp-location-${index}`}
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, { ...exp, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`exp-startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`exp-startDate-${index}`}
                    name="startDate"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, { ...exp, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                {!exp.isCurrent && (<>
                  <Label htmlFor={`exp-endDate-${index}`}>End Date</Label>
                  <Input
                    id={`exp-endDate-${index}`}
                    name="endDate"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, { ...exp, endDate: e.target.value })}
                  /></>
                )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={exp.isCurrent}
                  onCheckedChange={(checked) => updateExperience(index, { ...exp, isCurrent: checked })}
                  id={`exp-current-${index}`}
                />
                <Label htmlFor={`exp-current-${index}`}>Current Company</Label>
              </div>
              <Droppable droppableId={index.toString()} type="responsibility">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {exp.responsibilities.map((resp, respIndex) => (
                      <ResponsibilityItem
                        key={resp.id}
                        expIndex={index}
                        resp={resp}
                        index={respIndex}
                        updateResponsibility={updateResponsibility}
                        deleteResponsibility={deleteResponsibility}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button onClick={() => addResponsibility(index)}>
                <Plus className="mr-2 h-4 w-4" /> Add Responsibility
              </Button>
              </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

// Experience Section Component
const ExperienceSection = () => {
  const [experience, setExperience] = useAtom(experienceData);
  const { onDragEnd } = useDragAndDrop(experience, setExperience)

  const addExperience = () => {
    setExperience([...experience, getEmptyExperience()])
  }

  const updateExperience = (index: number, updatedExp: Experience) => {
    const newExperience = [...experience]
    newExperience[index] = updatedExp
    setExperience(newExperience)
  }

  const deleteExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index))
  }

  const addResponsibility = (expIndex: number) => {
    const newExperience = [...experience]
    const newResp: Responsibility = {
      id: Date.now().toString(),
      text: '',
      selected: true
    }
    newExperience[expIndex].responsibilities.push(newResp)
    setExperience(newExperience)
  }

  const updateResponsibility = (expIndex: number, respIndex: number, updatedResp: Responsibility) => {
    const newExperience = [...experience]
    newExperience[expIndex].responsibilities[respIndex] = updatedResp
    setExperience(newExperience)
  }

  const deleteResponsibility = (expIndex: number, respIndex: number) => {
    const newExperience = [...experience]
    newExperience[expIndex].responsibilities = newExperience[expIndex].responsibilities.filter((_, i) => i !== respIndex)
    setExperience(newExperience)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="experiences" type="experience">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {experience.map((exp, index) => (
                  <ExperienceEntry
                    key={exp.id}
                    exp={exp}
                    index={index}
                    updateExperience={updateExperience}
                    deleteExperience={deleteExperience}
                    addResponsibility={addResponsibility}
                    updateResponsibility={updateResponsibility}
                    deleteResponsibility={deleteResponsibility}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" /> Add New Experience
        </Button>
      </CardContent>
    </Card>
  )
}

export default ExperienceSection;