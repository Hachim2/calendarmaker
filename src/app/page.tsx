"use client"

import { TopBanner } from '@/components/ui/top-banner';
import CookieConsent from '@/components/ui/tracking-cookie';
import { Navbar } from '@/components/layout/navbar';
import { Building2, Users, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonExpandDocs, ButtonExpandBrowser } from '@/components/ui/button-expand';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Top Banner */}
      <TopBanner />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-16 md:py-12 md:pt-20 mb-24 relative">
        {/* Spacer to push content down */}
        <div className="h-[40px] md:h-[60px]"></div>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8 mb-16">
          {/* Left Column - Hero Section */}
          <div className="w-full md:w-1/2 pt-4 md:pt-16 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading mb-6 md:mb-8">
              Academic Calendar
              <div className="text-blue-600 dark:text-blue-400 font-heading mt-2">made simple</div>
            </h1>
            <p className="text-base sm:text-lg mb-8 md:mb-10 text-muted-foreground max-w-md">
              Create and manage academic calendars for your educational institution. Plan semesters, terms, and events with ease.
            </p>
            <div className="flex flex-wrap justify-start gap-4 md:gap-6">
              <ButtonExpandDocs />
              <ButtonExpandBrowser />
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {/* Configuration de l'école */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Configuration de l'école</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Configurez les informations de base de votre établissement scolaire.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Définissez les paramètres de votre école, les périodes scolaires, les vacances et les jours fériés.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Configurer
            </Button>
          </div>

          {/* Gestion des ressources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Gestion des ressources</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Gérez les enseignants, les salles et les classes de votre établissement.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Ajoutez et modifiez les informations sur les enseignants, les salles disponibles et les classes de votre établissement.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Gérer
            </Button>
          </div>

          {/* Création d'emplois du temps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Création d'emplois du temps</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Générez et gérez les emplois du temps de votre établissement.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Créez des emplois du temps pour les classes et les enseignants, gérez les contraintes et visualisez les résultats.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Créer
            </Button>
          </div>
        </div>

        {/* Comment ça fonctionne */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">Comment ça fonctionne</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
            Notre assistant vous guide à travers le processus de création d'emplois du temps en quelques étapes simples.
          </p>
          
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <div className="flex items-center gap-4 text-blue-600 dark:text-blue-300">
              <Building2 className="h-7 w-7" />
              <span className="text-lg">Configuration de l'école</span>
            </div>
            <div className="flex items-center gap-4 text-blue-600 dark:text-blue-300">
              <Users className="h-7 w-7" />
              <span className="text-lg">Enseignants</span>
            </div>
            <div className="flex items-center gap-4 text-blue-600 dark:text-blue-300">
              <BookOpen className="h-7 w-7" />
              <span className="text-lg">Matières</span>
            </div>
            <div className="flex items-center gap-4 text-blue-600 dark:text-blue-300">
              <Clock className="h-7 w-7" />
              <span className="text-lg">Créneaux horaires</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Cookie Consent */}
        <CookieConsent />
      </div>
    </div>
  );
}
