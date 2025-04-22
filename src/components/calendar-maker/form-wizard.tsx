"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase, saveSchool, saveRooms, saveClasses, saveTeachers, saveCourses, saveTimeSlots, saveHolidays } from "@/lib/supabase-client"
import { SchoolForm } from "@/components/calendar-maker/school-form"
import { RoomsForm } from "@/components/calendar-maker/rooms-form"
import { ClassesForm } from "@/components/calendar-maker/classes-form"
import { TeachersForm } from "@/components/calendar-maker/teachers-form"
import { CurriculumForm } from "@/components/calendar-maker/curriculum-form"
import { HolidaysForm } from "@/components/calendar-maker/holidays-form"
import { TimeSlotsForm } from "@/components/calendar-maker/time-slots-form"

type SchoolFormProps = {
  formData: any;
  updateFormData: (data: any) => void;
};

type Step = {
  id: string;
  title: string;
  description: string;
  component: ({ formData, updateFormData }: SchoolFormProps) => React.ReactElement;
};

const steps: Step[] = [
  {
    id: 'school',
    title: 'Informations de l\'école',
    description: 'Renseignez les informations de base de votre école',
    component: SchoolForm
  },
  {
    id: 'rooms',
    title: 'Salles',
    description: 'Ajoutez les salles de classe disponibles',
    component: RoomsForm
  },
  {
    id: 'classes',
    title: 'Classes',
    description: 'Créez les différentes classes',
    component: ClassesForm
  },
  {
    id: 'teachers',
    title: 'Enseignants',
    description: 'Ajoutez les enseignants',
    component: TeachersForm
  },
  {
    id: 'curriculum',
    title: 'Programme',
    description: 'Définissez le programme de l\'école',
    component: CurriculumForm
  },
  {
    id: 'time-slots',
    title: 'Horaires',
    description: 'Configurez les créneaux horaires',
    component: TimeSlotsForm
  }
];

interface FormWizardProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function FormWizard({ formData: initialFormData, setFormData: updateParentFormData }: FormWizardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    school: {},
    rooms: [],
    classes: [],
    teachers: [],
    curriculum: [],
    holidays: [],
    courses: [],
    schedule: [],
    timeSlots: [],
  })
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const CurrentStepComponent = steps[currentStep - 1].component

  const updateFormData = async (stepId: string, data: any) => {
    setIsLoading(true)

    try {
      const newData = { ...formData, [stepId]: data }
      setFormData(newData)
      updateParentFormData(newData)

      if (!completedSteps.includes(stepId)) {
        setCompletedSteps([...completedSteps, stepId])
      }

      toast({
        title: "Données sauvegardées",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error)
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la sauvegarde des données.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (completedSteps.length / steps.length) * 100

  const renderStep = () => {
    const CurrentStepComponent = steps[currentStep - 1].component;
    return (
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <CurrentStepComponent
          formData={formData}
          updateFormData={(data: any) => updateFormData(steps[currentStep - 1].id, data)}
        />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <p className="text-slate-600 dark:text-slate-300 text-center mb-6 text-base">
        Remplissez les informations de base pour votre école, puis accédez à la gestion des emplois du temps.
      </p>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="no-print">
          <div className="relative mb-8">
            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-6 gap-2 mt-4">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setCurrentStep(index + 1)}
                  className={`flex flex-col items-center group transition-all duration-300 ${
                    index + 1 <= currentStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 ${
                    index + 1 === currentStep
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/25'
                      : index + 1 < currentStep
                      ? 'bg-green-500 text-white shadow-md shadow-green-500/25'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium text-center transition-colors duration-300 ${
                    index + 1 === currentStep
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : index + 1 < currentStep
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100 text-center">{steps[currentStep - 1].title}</h2>
          <p className="text-base text-muted-foreground mb-6 text-center">{steps[currentStep - 1].description}</p>
        </div>
        <div className="max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {renderStep()}
        </div>
        <div className="no-print flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1 || isLoading}
            className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-4 py-1.5 text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Précédent
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={() => router.push("/schedules")}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md hover:shadow-indigo-500/25 transition-all px-6 py-1.5 text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white mr-1.5" />
                  Chargement...
                </>
              ) : (
                <>
                  Voir les emplois du temps
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md hover:shadow-indigo-500/25 transition-all px-6 py-1.5 text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white mr-1.5" />
                  Chargement...
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
