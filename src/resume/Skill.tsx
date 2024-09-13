'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getEmptySkill, skillData } from './Store'
import { useAtom } from 'jotai'

type Skill = {
  id: string
  name: string
  selected: boolean
}

type SkillCategory = {
  id: string
  title: string
  skills: Skill[]
  selected: boolean
}

const SkillItem = ({ skill, categoryIndex, index, updateSkill, deleteSkill }) => {
  return (
    <Draggable draggableId={`${categoryIndex}-${skill.id}`} index={index}>
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
            checked={skill.selected}
            onCheckedChange={(checked) => updateSkill(categoryIndex, index, { ...skill, selected: checked })}
            id={`skill-select-${categoryIndex}-${index}`}
          />
          <Input
            placeholder="Skill"
            value={skill.name}
            onChange={(e) => updateSkill(categoryIndex, index, { ...skill, name: e.target.value })}
            className="flex-grow"
          />
          <Button variant="destructive" size="icon" onClick={() => deleteSkill(categoryIndex, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  )
}

const SkillCategory = ({ category, index, updateCategory, deleteCategory, addSkill, updateSkill, deleteSkill }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <Draggable draggableId={category.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4 w-full"
        >
          <Card>
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="text-gray-400" />
                  </div>
                  <Checkbox
                    checked={category.selected}
                    onCheckedChange={(checked) => updateCategory(index, { ...category, selected: checked })}
                    id={`category-select-${index}`}
                  />
                  <Input
                    placeholder="Category Title"
                    value={category.title}
                    onChange={(e) => updateCategory(index, { ...category, title: e.target.value })}
                    className="font-medium"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteCategory(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isCollapsed && (
                <>
                  <Droppable droppableId={`category-${index}`} type="skill">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {category.skills.map((skill, skillIndex) => (
                          <SkillItem
                            key={skill.id}
                            skill={skill}
                            categoryIndex={index}
                            index={skillIndex}
                            updateSkill={updateSkill}
                            deleteSkill={deleteSkill}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Button onClick={() => addSkill(index)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Skill
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

export default function SkillSection() {
  const [categories, setCategories] = useAtom(skillData)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'category') {
      const newCategories = Array.from(categories)
      const [reorderedItem] = newCategories.splice(source.index, 1)
      newCategories.splice(destination.index, 0, reorderedItem)
      setCategories(newCategories)
    } else if (type === 'skill') {
      const categoryIndex = parseInt(source.droppableId.split('-')[1])
      const newCategories = [...categories]
      const [reorderedItem] = newCategories[categoryIndex].skills.splice(source.index, 1)
      newCategories[categoryIndex].skills.splice(destination.index, 0, reorderedItem)
      setCategories(newCategories)
    }
  }

  const addCategory = () => {
    setCategories([...categories, getEmptySkill()])
  }

  const updateCategory = (index: number, updatedCategory: SkillCategory) => {
    const newCategories = [...categories]
    newCategories[index] = updatedCategory
    setCategories(newCategories)
  }

  const deleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const addSkill = (categoryIndex: number) => {
    const newCategories = [...categories]
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      selected: true
    }
    newCategories[categoryIndex].skills.push(newSkill)
    setCategories(newCategories)
  }

  const updateSkill = (categoryIndex: number, skillIndex: number, updatedSkill: Skill) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].skills[skillIndex] = updatedSkill
    setCategories(newCategories)
  }

  const deleteSkill = (categoryIndex: number, skillIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].skills = newCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex)
    setCategories(newCategories)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {categories.map((category, index) => (
                  <SkillCategory
                    key={category.id}
                    category={category}
                    index={index}
                    updateCategory={updateCategory}
                    deleteCategory={deleteCategory}
                    addSkill={addSkill}
                    updateSkill={updateSkill}
                    deleteSkill={deleteSkill}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="mt-4">
          <Button onClick={addCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}