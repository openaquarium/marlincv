'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2,ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { achievementData, getEmptyAchievement } from './Store'
import { useAtom } from 'jotai'
import { Textarea } from '@/components/ui/textarea'

// Types
type Responsibility = {
  id: string
  text: string
  selected: boolean
}

type Achievement = {
  id: string
  competition: string
  position: string
  responsibilities: Responsibility[]
  date: string
  selected: boolean
}

// Custom hook for drag and drop logic
const useDragAndDrop = (achievement: Achievement[], setAchievement: React.Dispatch<React.SetStateAction<Achievement[]>>) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'achievement') {
      const newAchievement = Array.from(achievement)
      const [reorderedItem] = newAchievement.splice(source.index, 1)
      newAchievement.splice(destination.index, 0, reorderedItem)
      setAchievement(newAchievement)
    } else if (type === 'responsibility') {
      const newAchievement = [...achievement]
      const sourceAch = newAchievement[parseInt(source.droppableId)]
      const [reorderedItem] = sourceAch.responsibilities.splice(source.index, 1)
      const destAch = newAchievement[parseInt(destination.droppableId)]
      destAch.responsibilities.splice(destination.index, 0, reorderedItem)
      setAchievement(newAchievement)
    }
  }

  return { onDragEnd }
}

// Responsibility Item Component
const ResponsibilityItem = ({ achIndex, resp, index, updateResponsibility, deleteResponsibility }) => {
  return (
    <Draggable draggableId={`${achIndex}-${resp.id}`} index={index}>
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
            onCheckedChange={(checked) => updateResponsibility(achIndex, index, { ...resp, selected: checked })}
            id={`resp-select-${achIndex}-${index}`}
          />
          <Textarea
            placeholder="Responsibility"
            value={resp.text}
            onChange={(e) => updateResponsibility(achIndex, index, { ...resp, text: e.target.value })}
          />
          <Button variant="destructive" size="icon" onClick={() => deleteResponsibility(achIndex, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  )
}

// Achievement Entry Component
const AchievementEntry = ({ ach, index, updateAchievement, deleteAchievement, addResponsibility, updateResponsibility, deleteResponsibility }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Draggable draggableId={ach.id} index={index}>
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
                    checked={ach.selected}
                    onCheckedChange={(checked) => updateAchievement(index, { ...ach, selected: checked })}
                    id={`ach-select-${index}`}
                  />
                  <Label > {ach.competition || 'Competition Name'}  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteAchievement(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isCollapsed && (
              <>
              <div className="space-y-1">
                <Label htmlFor={`ach-competition-${index}`}>Competition Name</Label>
                <Input
                  id={`ach-competition-${index}`}
                  placeholder="Competition Name"
                  value={ach.competition}
                  onChange={(e) => updateAchievement(index, { ...ach, competition: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`ach-position-${index}`}>Position</Label>
                <Input
                  id={`ach-position-${index}`}
                  placeholder="Position"
                  value={ach.position}
                  onChange={(e) => updateAchievement(index, { ...ach, position: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`ach-location-${index}`}>Location</Label>
                <Input
                  id={`ach-location-${index}`}
                  placeholder="Location"
                  value={ach.location}
                  onChange={(e) => updateAchievement(index, { ...ach, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`ach-date-${index}`}>Date</Label>
                  <Input
                    id={`ach-date-${index}`}
                    name="date"
                    type="date"
                    value={ach.date}
                    onChange={(e) => updateAchievement(index, { ...ach, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                
                </div>
              </div>
              
              <Droppable droppableId={index.toString()} type="responsibility">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {ach.responsibilities.map((resp, respIndex) => (
                      <ResponsibilityItem
                        key={resp.id}
                        achIndex={index}
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

// Achievement Section Component
const AchievementSection2 = () => {
  const [achievement, setAchievement] = useAtom(achievementData);
  const { onDragEnd } = useDragAndDrop(achievement, setAchievement)

  const addAchievement = () => {
    setAchievement([...achievement, getEmptyAchievement()])
  }

  const updateAchievement = (index: number, updatedAch: Achievement) => {
    const newAchievement = [...achievement]
    newAchievement[index] = updatedAch
    setAchievement(newAchievement)
  }

  const deleteAchievement = (index: number) => {
    setAchievement(achievement.filter((_, i) => i !== index))
  }

  const addResponsibility = (achIndex: number) => {
    const newAchievement = [...achievement]
    const newResp: Responsibility = {
      id: Date.now().toString(),
      text: '',
      selected: true
    }
    newAchievement[achIndex].responsibilities.push(newResp)
    setAchievement(newAchievement)
  }

  const updateResponsibility = (achIndex: number, respIndex: number, updatedResp: Responsibility) => {
    const newAchievement = [...achievement]
    newAchievement[achIndex].responsibilities[respIndex] = updatedResp
    setAchievement(newAchievement)
  }

  const deleteResponsibility = (achIndex: number, respIndex: number) => {
    const newAchievement = [...achievement]
    newAchievement[achIndex].responsibilities = newAchievement[achIndex].responsibilities.filter((_, i) => i !== respIndex)
    setAchievement(newAchievement)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="achievements" type="achievement">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {achievement.map((ach, index) => (
                  <AchievementEntry
                    key={ach.id}
                    ach={ach}
                    index={index}
                    updateAchievement={updateAchievement}
                    deleteAchievement={deleteAchievement}
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
        <Button onClick={addAchievement}>
          <Plus className="mr-2 h-4 w-4" /> Add New Achievement
        </Button>
      </CardContent>
    </Card>
  )
}

export default AchievementSection2;