'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { projectData, getEmptyProject } from './Store'
import { useAtom } from 'jotai'
import { Textarea } from '@/components/ui/textarea'

// Types
type Responsibility = {
  id: string
  text: string
  selected: boolean
}

type Project = {
  id: string
  project: string
  link: string
  stack: string
  responsibilities: Responsibility[]
  selected: boolean
}

// Custom hook for drag and drop logic
const useDragAndDrop = (project: Project[], setProject: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'project') {
      const newProject = Array.from(project)
      const [reorderedItem] = newProject.splice(source.index, 1)
      newProject.splice(destination.index, 0, reorderedItem)
      setProject(newProject)
    } else if (type === 'responsibility') {
      const newProject = [...project]
      const sourceProj = newProject[parseInt(source.droppableId)]
      const [reorderedItem] = sourceProj.responsibilities.splice(source.index, 1)
      const destProj = newProject[parseInt(destination.droppableId)]
      destProj.responsibilities.splice(destination.index, 0, reorderedItem)
      setProject(newProject)
    }
  }

  return { onDragEnd }
}

// Responsibility Item Component
const ResponsibilityItem = ({ projIndex, resp, index, updateResponsibility, deleteResponsibility }) => {
  return (
    <Draggable draggableId={`${projIndex}-${resp.id}`} index={index}>
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
            onCheckedChange={(checked) => updateResponsibility(projIndex, index, { ...resp, selected: checked })}
            id={`resp-select-${projIndex}-${index}`}
          />
          <Textarea
            placeholder="Responsibility"
            value={resp.text}
            onChange={(e) => updateResponsibility(projIndex, index, { ...resp, text: e.target.value })}
          />
          <Button variant="destructive" size="icon" onClick={() => deleteResponsibility(projIndex, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  )
}

// Project Entry Component
const ProjectEntry = ({ proj, index, updateProject, deleteProject, addResponsibility, updateResponsibility, deleteResponsibility }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <Draggable draggableId={proj.id} index={index}>
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
                    checked={proj.selected}
                    onCheckedChange={(checked) => updateProject(index, { ...proj, selected: checked })}
                    id={`proj-select-${index}`}
                  />
                  <Label > {proj.name || 'Project Name'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteProject(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isCollapsed && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor={`proj-project-${index}`}>Project Name</Label>
                    <Input
                      id={`proj-project-${index}`}
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => updateProject(index, { ...proj, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`proj-stack-${index}`}>Stack</Label>
                    <Input
                      id={`proj-stack-${index}`}
                      placeholder="Stack"
                      value={proj.stack}
                      onChange={(e) => updateProject(index, { ...proj, stack: e.target.value })}
                    />
                  </div>
                  {/* <div className="space-y-1">
                    <Label htmlFor={`proj-result-${index}`}>Result</Label>
                    <Input
                      id={`proj-result-${index}`}
                      placeholder="Result"
                      value={proj.result}
                      onChange={(e) => updateProject(index, { ...proj, result: e.target.value })}
                    />
                  </div> */}
                  <div className="space-y-1">
                    <Label htmlFor={`proj-link-${index}`}>link</Label>
                    <Input
                      id={`proj-link-${index}`}
                      placeholder="link"
                      value={proj.link}
                      onChange={(e) => updateProject(index, { ...proj, link: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`proj-startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`proj-startDate-${index}`}
                        name="startDate"
                        type="date"
                        value={proj.startDate}
                        onChange={(e) => updateProject(index, { ...proj, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      {!proj.isCurrent && (<>
                        <Label htmlFor={`proj-endDate-${index}`}>End Date</Label>
                        <Input
                          id={`proj-endDate-${index}`}
                          name="endDate"
                          type="date"
                          value={proj.endDate}
                          onChange={(e) => updateProject(index, { ...proj, endDate: e.target.value })}
                        /></>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={proj.isCurrent}
                      onCheckedChange={(checked) => updateProject(index, { ...proj, isCurrent: checked })}
                      id={`proj-current-${index}`}
                    />
                    <Label htmlFor={`proj-current-${index}`}>Current Project</Label>
                  </div>
                  <Droppable droppableId={index.toString()} type="responsibility">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {proj.responsibilities.map((resp, respIndex) => (
                          <ResponsibilityItem
                            key={resp.id}
                            projIndex={index}
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

// Project Section Component
const ProjectSection = () => {
  const [project, setProject] = useAtom(projectData);
  const { onDragEnd } = useDragAndDrop(project, setProject)

  const addProject = () => {
    setProject([...project, getEmptyProject()])
  }

  const updateProject = (index: number, updatedProj: Project) => {
    const newProject = [...project]
    newProject[index] = updatedProj
    setProject(newProject)
  }

  const deleteProject = (index: number) => {
    setProject(project.filter((_, i) => i !== index))
  }

  const addResponsibility = (projIndex: number) => {
    const newProject = [...project]
    const newResp: Responsibility = {
      id: Date.now().toString(),
      text: '',
      selected: true
    }
    newProject[projIndex].responsibilities.push(newResp)
    setProject(newProject)
  }

  const updateResponsibility = (projIndex: number, respIndex: number, updatedResp: Responsibility) => {
    const newProject = [...project]
    newProject[projIndex].responsibilities[respIndex] = updatedResp
    setProject(newProject)
  }

  const deleteResponsibility = (projIndex: number, respIndex: number) => {
    const newProject = [...project]
    newProject[projIndex].responsibilities = newProject[projIndex].responsibilities.filter((_, i) => i !== respIndex)
    setProject(newProject)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="projects" type="project">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {project.map((proj, index) => (
                  <ProjectEntry
                    key={proj.id}
                    proj={proj}
                    index={index}
                    updateProject={updateProject}
                    deleteProject={deleteProject}
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
        <Button onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProjectSection;