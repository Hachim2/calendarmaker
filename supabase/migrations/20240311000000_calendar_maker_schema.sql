-- Calendar Maker Schema Migration

-- Calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  academic_year text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_template boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id uuid REFERENCES calendars(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  all_day boolean DEFAULT false,
  color text,
  recurring_pattern jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Entities table (teachers, classes, students, staff)
CREATE TABLE IF NOT EXISTS public.entities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL, -- 'teacher', 'class', 'student', 'staff'
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Calendar to entity assignments
CREATE TABLE IF NOT EXISTS public.calendar_entity_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id uuid REFERENCES calendars(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(calendar_id, entity_id)
);

-- Event to entity assignments
CREATE TABLE IF NOT EXISTS public.event_entity_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES calendar_events(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, entity_id)
);

-- Row-level security policies
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entity_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_entity_assignments ENABLE ROW LEVEL SECURITY;

-- Calendar RLS policies
CREATE POLICY "Users can view calendars they created"
  ON public.calendars
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own calendars"
  ON public.calendars
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update calendars they created"
  ON public.calendars
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete calendars they created"
  ON public.calendars
  FOR DELETE
  USING (auth.uid() = created_by);

-- Calendar events RLS policies
CREATE POLICY "Users can view events for calendars they created"
  ON public.calendar_events
  FOR SELECT
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can insert events for calendars they created"
  ON public.calendar_events
  FOR INSERT
  WITH CHECK (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can update events for calendars they created"
  ON public.calendar_events
  FOR UPDATE
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can delete events for calendars they created"
  ON public.calendar_events
  FOR DELETE
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

-- Entities RLS policies (simplified for now, can be expanded later)
CREATE POLICY "All authenticated users can view entities"
  ON public.entities
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can create entities"
  ON public.entities
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can update entities"
  ON public.entities
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can delete entities"
  ON public.entities
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Calendar entity assignments RLS policies
CREATE POLICY "Users can view calendar-entity assignments for their calendars"
  ON public.calendar_entity_assignments
  FOR SELECT
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can create calendar-entity assignments for their calendars"
  ON public.calendar_entity_assignments
  FOR INSERT
  WITH CHECK (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can update calendar-entity assignments for their calendars"
  ON public.calendar_entity_assignments
  FOR UPDATE
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can delete calendar-entity assignments for their calendars"
  ON public.calendar_entity_assignments
  FOR DELETE
  USING (calendar_id IN (
    SELECT id FROM public.calendars WHERE created_by = auth.uid()
  ));

-- Event entity assignments RLS policies
CREATE POLICY "Users can view event-entity assignments for their calendars"
  ON public.event_entity_assignments
  FOR SELECT
  USING (event_id IN (
    SELECT ce.id FROM public.calendar_events ce
    JOIN public.calendars c ON ce.calendar_id = c.id
    WHERE c.created_by = auth.uid()
  ));

CREATE POLICY "Users can create event-entity assignments for their calendars"
  ON public.event_entity_assignments
  FOR INSERT
  WITH CHECK (event_id IN (
    SELECT ce.id FROM public.calendar_events ce
    JOIN public.calendars c ON ce.calendar_id = c.id
    WHERE c.created_by = auth.uid()
  ));

CREATE POLICY "Users can update event-entity assignments for their calendars"
  ON public.event_entity_assignments
  FOR UPDATE
  USING (event_id IN (
    SELECT ce.id FROM public.calendar_events ce
    JOIN public.calendars c ON ce.calendar_id = c.id
    WHERE c.created_by = auth.uid()
  ));

CREATE POLICY "Users can delete event-entity assignments for their calendars"
  ON public.event_entity_assignments
  FOR DELETE
  USING (event_id IN (
    SELECT ce.id FROM public.calendar_events ce
    JOIN public.calendars c ON ce.calendar_id = c.id
    WHERE c.created_by = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendars_created_by ON public.calendars(created_by);
CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar_id ON public.calendar_events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_entities_type ON public.entities(type);
CREATE INDEX IF NOT EXISTS idx_calendar_entity_assignments_calendar_id ON public.calendar_entity_assignments(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_entity_assignments_entity_id ON public.calendar_entity_assignments(entity_id);
CREATE INDEX IF NOT EXISTS idx_event_entity_assignments_event_id ON public.event_entity_assignments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_entity_assignments_entity_id ON public.event_entity_assignments(entity_id); 