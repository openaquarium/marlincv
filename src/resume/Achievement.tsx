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
import { achievementData, emptyAchievement } from "./Store";
import { useAtom } from 'jotai'




// Achievements Section Component
const AchievementsSection = () => {
  const [achievements, setAchievements] = useAtom(achievementData)
  const addAchievement = () => {
    setAchievements([...achievements, { ...emptyAchievement }])
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

  }

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newAchievements = [...achievements]
    newAchievements[index][name] = value
    setAchievements(newAchievements)
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
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="text-gray-400" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={achievement.selected}
                                onCheckedChange={(checked) => handleInputChange(index, { target: { name: 'selected', value: checked } })}
                                id={`achievement-select-${index}`}
                              />
                              <Label htmlFor={`exp-select-${index}`}>Select/Deselect</Label>
                            </div>
                            <Button variant="destructive" size="icon" onClick={() => deleteAchievement(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>


                          <div className="space-y-1">
                            <Label htmlFor={`achievement-competition-${index}`}>Competition Name</Label>
                            <Input
                              id={`achievement-competition-${index}`}
                              placeholder="Competition Name"
                              value={achievement.competition}
                              name="competition"
                              onChange={(e) => handleInputChange(index, e)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">

                            <div className="space-y-2">
                              <Label htmlFor={`achievement-position-${index}`}>Position</Label>
                              <Input
                                id={`achievement-position-${index}`}
                                placeholder="Position"
                                value={achievement.position}
                                name='position'
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`date-${index}`}>End Date</Label>
                              <Input
                                id={`date-${index}`}
                                name="date"
                                type="date"
                                value={achievement.date}
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                          </div>

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

export default AchievementsSection;
