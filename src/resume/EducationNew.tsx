'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { educationData, getEmptyEducation } from './Store'
import { useAtom } from 'jotai'
import { Textarea } from '@/components/ui/textarea'

// Types
type Responsibility = {
  id: string
  text: string
  selected: boolean
}

type Education = {
  id: string
  institution: string
  location: string
  degree: string
  responsibilities: Responsibility[]
  selected: boolean
}

// Custom hook for drag and drop logic
const useDragAndDrop = (education: Education[], setEducation: React.Dispatch<React.SetStateAction<Education[]>>) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'education') {
      const newEducation = Array.from(education)
      const [reorderedItem] = newEducation.splice(source.index, 1)
      newEducation.splice(destination.index, 0, reorderedItem)
      setEducation(newEducation)
    } else if (type === 'responsibility') {
      const newEducation = [...education]
      const sourceEdu = newEducation[parseInt(source.droppableId)]
      const [reorderedItem] = sourceEdu.responsibilities.splice(source.index, 1)
      const destEdu = newEducation[parseInt(destination.droppableId)]
      destEdu.responsibilities.splice(destination.index, 0, reorderedItem)
      setEducation(newEducation)
    }
  }

  return { onDragEnd }
}

// Responsibility Item Component
const ResponsibilityItem = ({ eduIndex, resp, index, updateResponsibility, deleteResponsibility }) => {
  return (
    <Draggable draggableId={`${eduIndex}-${resp.id}`} index={index}>
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
            onCheckedChange={(checked) => updateResponsibility(eduIndex, index, { ...resp, selected: checked })}
            id={`resp-select-${eduIndex}-${index}`}
          />
          <Textarea
            placeholder="Responsibility"
            value={resp.text}
            onChange={(e) => updateResponsibility(eduIndex, index, { ...resp, text: e.target.value })}
          />
          <Button variant="destructive" size="icon" onClick={() => deleteResponsibility(eduIndex, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  )
}

// Education Entry Component
const EducationEntry = ({ edu, index, updateEducation, deleteEducation, addResponsibility, updateResponsibility, deleteResponsibility }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Draggable draggableId={edu.id} index={index}>
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
                    checked={edu.selected}
                    onCheckedChange={(checked) => updateEducation(index, { ...edu, selected: checked })}
                    id={`edu-select-${index}`}
                  />
                  <Label > {edu.institution || 'Institution Name'} | {edu.degree} </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteEducation(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isCollapsed && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor={`edu-institution-${index}`}>Institution Name</Label>
                    <Input
                      id={`edu-institution-${index}`}
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, { ...edu, institution: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                    <Input
                      id={`edu-degree-${index}`}
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`edu-result-${index}`}>Result</Label>
                    <Input
                      id={`edu-result-${index}`}
                      placeholder="Result"
                      value={edu.result}
                      onChange={(e) => updateEducation(index, { ...edu, result: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`edu-location-${index}`}>Location</Label>
                    <Input
                      id={`edu-location-${index}`}
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, { ...edu, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`edu-startDate-${index}`}
                        name="startDate"
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, { ...edu, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      {!edu.isCurrent && (<>
                        <Label htmlFor={`edu-endDate-${index}`}>End Date</Label>
                        <Input
                          id={`edu-endDate-${index}`}
                          name="endDate"
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, { ...edu, endDate: e.target.value })}
                        /></>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={edu.isCurrent}
                      onCheckedChange={(checked) => updateEducation(index, { ...edu, isCurrent: checked })}
                      id={`edu-current-${index}`}
                    />
                    <Label htmlFor={`edu-current-${index}`}>Current Institution</Label>
                  </div>
                  <Droppable droppableId={index.toString()} type="responsibility">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {edu.responsibilities.map((resp, respIndex) => (
                          <ResponsibilityItem
                            key={resp.id}
                            eduIndex={index}
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

// Education Section Component
const EducationSection2 = () => {
  const [education, setEducation] = useAtom(educationData);
  const { onDragEnd } = useDragAndDrop(education, setEducation)

  const addEducation = () => {
    setEducation([...education, getEmptyEducation()])
  }

  const updateEducation = (index: number, updatedEdu: Education) => {
    const newEducation = [...education]
    newEducation[index] = updatedEdu
    setEducation(newEducation)
  }

  const deleteEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const addResponsibility = (eduIndex: number) => {
    const newEducation = [...education]
    const newResp: Responsibility = {
      id: Date.now().toString(),
      text: '',
      selected: true
    }
    newEducation[eduIndex].responsibilities.push(newResp)
    setEducation(newEducation)
  }

  const updateResponsibility = (eduIndex: number, respIndex: number, updatedResp: Responsibility) => {
    const newEducation = [...education]
    newEducation[eduIndex].responsibilities[respIndex] = updatedResp
    setEducation(newEducation)
  }

  const deleteResponsibility = (eduIndex: number, respIndex: number) => {
    const newEducation = [...education]
    newEducation[eduIndex].responsibilities = newEducation[eduIndex].responsibilities.filter((_, i) => i !== respIndex)
    setEducation(newEducation)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="educations" type="education">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {education.map((edu, index) => (
                  <EducationEntry
                    key={edu.id}
                    edu={edu}
                    index={index}
                    updateEducation={updateEducation}
                    deleteEducation={deleteEducation}
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
        <Button onClick={addEducation}>
          <Plus className="mr-2 h-4 w-4" /> Add New Education
        </Button>
      </CardContent>
    </Card>
  )
}

export default EducationSection2;