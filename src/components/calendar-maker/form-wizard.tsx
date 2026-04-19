"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SchoolForm } from "@/components/calendar-maker/school-form"
import { RoomsForm } from "@/components/calendar-maker/rooms-form"
import { ClassesForm } from "@/components/calendar-maker/classes-form"
import { TeachersForm } from "@/components/calendar-maker/teachers-form"
import { CurriculumForm } from "@/components/calendar-maker/curriculum-form"
import { TimeSlotsForm } from "@/components/calendar-maker/time-slots-form"

type StepComponentProps = {
  formData: any
  updateFormData: (data: any) => void
}

type Step = {
  id: string
  title: string
  description: string
  component: (props: StepComponentProps) => React.ReactElement
}

const steps: Step[] = [
  { id: "school", title: "École", description: "Informations de base de votre établissement", component: SchoolForm },
  { id: "rooms", title: "Salles", description: "Salles de classe disponibles", component: RoomsForm },
  { id: "classes", title: "Classes", description: "Groupes et niveaux", component: ClassesForm },
  { id: "teachers", title: "Enseignants", description: "Corps enseignant", component: TeachersForm },
  { id: "curriculum", title: "Programme", description: "Matières et heures par niveau", component: CurriculumForm },
  { id: "time-slots", title: "Horaires", description: "Créneaux horaires de la semaine", component: TimeSlotsForm },
]

interface FormWizardProps {
  formData: any
  setFormData: (data: any) => void
  onComplete: () => void
}

export function FormWizard({ formData: initialFormData, setFormData: updateParentFormData, onComplete }: FormWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => ({
    school: {},
    rooms: [],
    classes: [],
    teachers: [],
    curriculum: [],
    courses: [],
    timeSlots: [],
    schedule: [],
    ...(initialFormData || {}),
  }))
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = async (stepId: string, data: any) => {
    setIsLoading(true)
    try {
      let newData: any

      // Curriculum step returns { curriculum, courses } — spread both at top level
      if (stepId === "curriculum" && data && typeof data === "object" && "curriculum" in data) {
        newData = { ...formData, curriculum: data.curriculum, courses: data.courses ?? formData.courses }
      } else {
        newData = { ...formData, [stepId]: data }
      }

      setFormData(newData)
      updateParentFormData(newData)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast({ title: "Erreur", description: "Un problème est survenu lors de la sauvegarde.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    updateParentFormData(formData)
    onComplete()
  }

  const completedStepIds = steps
    .map((step) => step.id)
    .filter((id) => {
      if (id === "curriculum") return (formData.curriculum?.length ?? 0) > 0
      if (id === "time-slots") return (formData.timeSlots?.length ?? 0) > 0
      const val = (formData as any)[id]
      if (Array.isArray(val)) return val.length > 0
      if (val && typeof val === "object") return Object.keys(val).length > 0
      return false
    })

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-6 gap-2">
            {steps.map((step, index) => {
              const isDone = completedStepIds.includes(step.id)
              const isCurrent = index + 1 === currentStep
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(index + 1)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isCurrent ? "opacity-100" : index + 1 < currentStep ? "opacity-90" : "opacity-40"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/25"
                        : isDone
                        ? "bg-green-500 text-white shadow-md shadow-green-500/25"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {isDone && !isCurrent ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-medium text-center leading-tight transition-colors ${
                      isCurrent
                        ? "text-indigo-600 dark:text-indigo-400"
                        : isDone
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-1 text-slate-800 dark:text-slate-100 text-center">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-sm text-muted-foreground mb-5 text-center">{steps[currentStep - 1].description}</p>

        {/* Step content */}
        <div className="max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
            {React.createElement(steps[currentStep - 1].component, {
              formData,
              updateFormData: (data: any) => updateFormData(steps[currentStep - 1].id, data),
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1 || isLoading}
            className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Précédent
          </Button>

          {currentStep === steps.length ? (
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1.5" />
              )}
              Terminer et générer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
