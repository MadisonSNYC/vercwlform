"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function TestFormsPage() {
  const [textInput, setTextInput] = useState("")
  const [textareaInput, setTextareaInput] = useState("")
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioSelected, setRadioSelected] = useState("option-one")
  const [selectValue, setSelectValue] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState("info") // info, success, error, warning

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      textInput,
      textareaInput,
      checkboxChecked,
      radioSelected,
      selectValue,
    })
    setShowAlert(true)
    setAlertType("success")
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Shadcn/ui Component Test Page</h1>

      {/* Input Component */}
      <Card>
        <CardHeader>
          <CardTitle>Input Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="text-input">Text Input</Label>
          <Input
            id="text-input"
            placeholder="Enter text here"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">Current value: {textInput}</p>
        </CardContent>
      </Card>

      {/* Textarea Component */}
      <Card>
        <CardHeader>
          <CardTitle>Textarea Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="textarea-input">Textarea</Label>
          <Textarea
            id="textarea-input"
            placeholder="Enter multi-line text here"
            value={textareaInput}
            onChange={(e) => setTextareaInput(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">Current value: {textareaInput}</p>
        </CardContent>
      </Card>

      {/* Checkbox Component */}
      <Card>
        <CardHeader>
          <CardTitle>Checkbox Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkbox-test"
              checked={checkboxChecked}
              onCheckedChange={(checked) => setCheckboxChecked(!!checked)}
            />
            <Label htmlFor="checkbox-test">Accept terms and conditions</Label>
          </div>
          <p className="text-sm text-gray-500 mt-2">Checked: {checkboxChecked ? "Yes" : "No"}</p>
        </CardContent>
      </Card>

      {/* RadioGroup Component */}
      <Card>
        <CardHeader>
          <CardTitle>RadioGroup Component</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={radioSelected} onValueChange={setRadioSelected}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="r1" />
              <Label htmlFor="r1">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="r2" />
              <Label htmlFor="r2">Option Two</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-2">Selected: {radioSelected}</p>
        </CardContent>
      </Card>

      {/* Select Component */}
      <Card>
        <CardHeader>
          <CardTitle>Select Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="select-test">Select an option</Label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger id="select-test" className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">Selected: {selectValue}</p>
        </CardContent>
      </Card>

      {/* Button Component */}
      <Card>
        <CardHeader>
          <CardTitle>Button Component</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => alert("Default Button Clicked!")}>Default Button</Button>
          <Button variant="secondary" onClick={() => alert("Secondary Button Clicked!")}>
            Secondary Button
          </Button>
          <Button variant="destructive" onClick={() => alert("Destructive Button Clicked!")}>
            Destructive Button
          </Button>
          <Button variant="outline" onClick={() => alert("Outline Button Clicked!")}>
            Outline Button
          </Button>
          <Button variant="ghost" onClick={() => alert("Ghost Button Clicked!")}>
            Ghost Button
          </Button>
          <Button variant="link" onClick={() => alert("Link Button Clicked!")}>
            Link Button
          </Button>
        </CardContent>
      </Card>

      {/* Alert Component */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              onClick={() => {
                setShowAlert(true)
                setAlertType("info")
              }}
            >
              Show Info Alert
            </Button>
            <Button
              onClick={() => {
                setShowAlert(true)
                setAlertType("success")
              }}
            >
              Show Success Alert
            </Button>
            <Button
              onClick={() => {
                setShowAlert(true)
                setAlertType("warning")
              }}
            >
              Show Warning Alert
            </Button>
            <Button
              onClick={() => {
                setShowAlert(true)
                setAlertType("error")
              }}
            >
              Show Error Alert
            </Button>
            <Button onClick={() => setShowAlert(false)}>Hide Alert</Button>
          </div>
          {showAlert && (
            <Alert variant={alertType as "default" | "destructive"}>
              {alertType === "info" && <Info className="h-4 w-4" />}
              {alertType === "success" && <CheckCircle className="h-4 w-4" />}
              {alertType === "warning" && <AlertTriangle className="h-4 w-4" />}
              {alertType === "error" && <XCircle className="h-4 w-4" />}
              <AlertTitle>
                {alertType === "info" && "Heads up!"}
                {alertType === "success" && "Success!"}
                {alertType === "warning" && "Warning!"}
                {alertType === "error" && "Error!"}
              </AlertTitle>
              <AlertDescription>
                This is an example of a {alertType} alert. It provides feedback to the user.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Form Submission Test */}
      <Card>
        <CardHeader>
          <CardTitle>Form Submission Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="submit-input">Submit Input</Label>
              <Input
                id="submit-input"
                placeholder="Type something to submit"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit Form</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
