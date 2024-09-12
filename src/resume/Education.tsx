'use client'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAtom } from 'jotai'

import { educationData, emptyEducation } from "./Store";

const EducationSection = () => {

    const [education, setEducation] = useAtom(educationData)
    
    const addEducation = () => {
      setEducation([...education,  {...emptyEducation}])
    }
  
    const deleteEducation = (index) => {
      const newEducation = education.filter((_, i) => i !== index)
      setEducation(newEducation)
    }

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const newEducation = [...education]
        newEducation[index][name] = value
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
                      name="selected"
                      onCheckedChange={(e) => handleInputChange(index, { target: { name: 'selected', value: e } })}
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
                    name="institution"
                    onChange={(e) => handleInputChange(index, e)}
                   
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`edu-result-${index}`}>Result</Label>
                  <Input
                    id={`edu-result-${index}`}
                    placeholder="Result"
                    value={edu.result}
                    name="result"
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      name="startDate"
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      name="endDate"
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`edu-description-${index}`}>Description</Label>
                  <Textarea
                    id={`edu-description-${index}`}
                    placeholder="Description"
                    value={edu.description}
                    name="description"
                    onChange={(e) => handleInputChange(index, e)}
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

  export default EducationSection;