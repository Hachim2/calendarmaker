'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Calendar, calendarSchema } from '@/types/calendar';
import { z } from 'zod';
import { format } from 'date-fns';

interface CalendarFormProps {
    initialData?: Partial<Calendar>;
    isEditing?: boolean;
}

type CalendarFormValues = z.infer<typeof calendarSchema>;

export default function CalendarForm({
    initialData,
    isEditing = false,
}: CalendarFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CalendarFormValues>({
        resolver: zodResolver(calendarSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            academic_year: initialData?.academic_year || '',
            start_date: initialData?.start_date
                ? format(new Date(initialData.start_date), 'yyyy-MM-dd')
                : format(new Date(), 'yyyy-MM-dd'),
            end_date: initialData?.end_date
                ? format(new Date(initialData.end_date), 'yyyy-MM-dd')
                : format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'yyyy-MM-dd'),
            is_template: initialData?.is_template || false,
        },
    });

    const onSubmit = async (data: CalendarFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (isEditing && initialData?.id) {
                // Update existing calendar
                const { error: updateError } = await supabase
                    .from('calendars')
                    .update(data)
                    .eq('id', initialData.id);

                if (updateError) throw updateError;

                router.push(`/calendar-maker/${initialData.id}`);
                router.refresh();
            } else {
                // Create new calendar
                const { data: newCalendar, error: insertError } = await supabase
                    .from('calendars')
                    .insert([data])
                    .select();

                if (insertError) throw insertError;

                if (newCalendar && newCalendar.length > 0) {
                    router.push(`/calendar-maker/${newCalendar[0].id}`);
                    router.refresh();
                }
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save calendar';
            setError(errorMessage);
            console.error('Error saving calendar:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Calendar Title <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="title"
                        {...register('title')}
                        className="w-full rounded-md border border-input px-3 py-2"
                        placeholder="School Year 2024-2025"
                    />
                    {errors.title && (
                        <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        className="w-full rounded-md border border-input px-3 py-2 min-h-[100px]"
                        placeholder="Calendar description..."
                    />
                    {errors.description && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="academic_year" className="block text-sm font-medium mb-1">
                        Academic Year
                    </label>
                    <input
                        id="academic_year"
                        {...register('academic_year')}
                        className="w-full rounded-md border border-input px-3 py-2"
                        placeholder="2024-2025"
                    />
                    {errors.academic_year && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.academic_year.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                            Start Date <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="start_date"
                            type="date"
                            {...register('start_date')}
                            className="w-full rounded-md border border-input px-3 py-2"
                        />
                        {errors.start_date && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.start_date.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium mb-1">
                            End Date <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="end_date"
                            type="date"
                            {...register('end_date')}
                            className="w-full rounded-md border border-input px-3 py-2"
                        />
                        {errors.end_date && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.end_date.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        id="is_template"
                        type="checkbox"
                        {...register('is_template')}
                        className="rounded border-input"
                    />
                    <label htmlFor="is_template" className="text-sm font-medium">
                        Save as a template
                    </label>
                    {errors.is_template && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.is_template.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-secondary text-secondary-foreground rounded-md px-4 py-2 hover:bg-secondary/90"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 disabled:opacity-70"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Calendar' : 'Create Calendar'}
                </button>
            </div>
        </form>
    );
} 