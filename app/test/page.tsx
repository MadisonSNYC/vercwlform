"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function TestPage() {
  const [inputValue, setInputValue] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [selectValue, setSelectValue] = useState("apple")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Component Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Input Example */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="test-input">Text Input</Label>
            <Input
              id="test-input"
              placeholder="Enter text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <p className="text-sm text-gray-500">Value: {inputValue}</p>
          </CardContent>
        </Card>

        {/* Textarea Example */}
        <Card>
          <CardHeader>
            <CardTitle>Textarea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="test-textarea">Textarea</Label>
            <Textarea
              id="test-textarea"
              placeholder="Enter multi-line text"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
            <p className="text-sm text-gray-500">Value: {textareaValue}</p>
          </CardContent>
        </Card>

        {/* Checkbox Example */}
        <Card>
          <CardHeader>
            <CardTitle>Checkbox</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Checkbox
              id="test-checkbox"
              checked={checkboxValue}
              onCheckedChange={(checked) => setCheckboxValue(!!checked)}
            />
            <Label htmlFor="test-checkbox">Accept terms</Label>
            <p className="text-sm text-gray-500">Checked: {checkboxValue ? "Yes" : "No"}</p>
          </CardContent>
        </Card>

        {/* RadioGroup Example */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500">Selected: {radioValue}</p>
          </CardContent>
        </Card>

        {/* Select Example */}
        <Card>
          <CardHeader>
            <CardTitle>Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="test-select">Choose a fruit</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger id="test-select" className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">Selected: {selectValue}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
