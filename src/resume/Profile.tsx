'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAtom } from 'jotai'
import {profileData} from './Store';
import { Textarea } from '@/components/ui/textarea'


type Profile = {
  name: string
  describeYourselfForAi: string
  jobDescription: string
  phone: string
  location: string
  email: string
  portfolio: string
  github: string
  linkedin: string
}

export default function ProfileSection() {
  const [profile, setProfile] = useAtom(profileData)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const updateProfile = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }




  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Profile & Job Description</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle profile section</span>
        </Button>
      </CardHeader>
      <CardContent>

        <div className="space-y-2 mt-4">
              <Label htmlFor="name">Job Description</Label>
              <Textarea
                id="jobDescription"
                className='h-32'
                value={profile.jobDescription}
                onChange={(e) => updateProfile('jobDescription', e.target.value)}
                placeholder="Your Job Description"
              />
        </div>
        {!isCollapsed && (
          <>
          <div className="space-y-2 mt-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => updateProfile('name', e.target.value)}
            placeholder="Your Name"
          />


        </div>

            <div className="space-y-2">
              <Label htmlFor="name">Describe Yourself For AI</Label>
              <Textarea
              className='h-32'
                id="describeYourselfForAi"
                value={profile.describeYourselfForAi}
                onChange={(e) => updateProfile('describeYourselfForAi', e.target.value)}
                placeholder="Your Profile Description"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="Your Phone Number"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => updateProfile('location', e.target.value)}
                placeholder="Your Location"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="Your Email"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                type="portfolio"
                value={profile.portfolio}
                onChange={(e) => updateProfile('portfolio', e.target.value)}
                placeholder="Your Portfolio URL"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="github">Github</Label>
              <Input
                id="github"
                type="github"
                value={profile.github}
                onChange={(e) => updateProfile('github', e.target.value)}
                placeholder="Your Github URL"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="linkedin">Linked In</Label>
              <Input
                id="linkedin"
                type="linkedin"
                value={profile.linkedin}
                onChange={(e) => updateProfile('linkedin', e.target.value)}
                placeholder="Your Linked URL"
              />
            </div>

          </>
        )}
      </CardContent>
    </Card>
  )
}
