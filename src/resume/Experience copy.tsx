"use client";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { experienceData, emptyExperience } from "./Store";
import { useAtom } from "jotai";

// Education Section Component

// Experience Section Component
const ExperienceSection = () => {
  const [experience, setExperience] = useAtom(experienceData);

  const addExperience = () => {
    setExperience([...experience, { ...emptyExperience }]);
  };

  const deleteExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
  };

  const addResponsibility = (expIndex) => {
    const newExperience = [...experience];
    newExperience[expIndex].responsibilities.push({ text: "", selected: true });
    setExperience(newExperience);
  };

  const deleteResponsibility = (expIndex, respIndex) => {
    const newExperience = [...experience];
    newExperience[expIndex].responsibilities = newExperience[
      expIndex
    ].responsibilities.filter((_, i) => i !== respIndex);
    setExperience(newExperience);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newExperience = [...experience];
    const [reorderedItem] = newExperience[
      result.source.droppableId
    ].responsibilities.splice(result.source.index, 1);
    newExperience[result.destination.droppableId].responsibilities.splice(
      result.destination.index,
      0,
      reorderedItem
    );

    setExperience(newExperience);
  };

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[index][name] = value;
    setExperience(newExperience);
  };

  const handleExperienceResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[expIndex].responsibilities[respIndex][name] = value;
    setExperience(newExperience);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map((exp, expIndex) => (
          <Card key={expIndex}>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exp.selected}
                    onCheckedChange={(checked) =>
                      handleInputChange(expIndex, {
                        target: { name: "selected", value: checked },
                      })
                    }
                    id={`exp-select-${expIndex}`}
                  />
                  <Label htmlFor={`exp-select-${expIndex}`}>
                    Select/Deselect
                  </Label>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteExperience(expIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`exp-company-${expIndex}`}>Company Name</Label>
                <Input
                  id={`exp-company-${expIndex}`}
                  placeholder="Company Name"
                  value={exp.company}
                  name="company"
                  onChange={(e) => handleInputChange(expIndex, e)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`exp-position-${expIndex}`}>Position</Label>
                <Input
                  id={`exp-position-${expIndex}`}
                  placeholder="Position"
                  value={exp.position}
                  name="position"
                  onChange={(e) => handleInputChange(expIndex, e)}
                />
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={expIndex.toString()}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {exp.responsibilities.map((resp, respIndex) => (
                        <Draggable
                          key={respIndex}
                          draggableId={`${expIndex}-${respIndex}`}
                          index={respIndex}
                        >
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
                                onCheckedChange={(checked) =>
                                  handleExperienceResponsibilityChange(
                                    expIndex,
                                    respIndex,
                                    {
                                      target: {
                                        name: "selected",
                                        value: checked,
                                      },
                                    }
                                  )
                                }
                                id={`resp-select-${expIndex}-${respIndex}`}
                              />
                              <Input
                                placeholder="Responsibility"
                                value={resp.text}
                                name="text"
                                onChange={(e) =>
                                  handleExperienceResponsibilityChange(
                                    expIndex,
                                    respIndex,
                                    e
                                  )
                                }
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  deleteResponsibility(expIndex, respIndex)
                                }
                              >
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
              </DragDropContext>
              <Button onClick={() => addResponsibility(expIndex)}>
                <Plus className="mr-2 h-4 w-4" /> Add Responsibility
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" /> Add New Experience
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
