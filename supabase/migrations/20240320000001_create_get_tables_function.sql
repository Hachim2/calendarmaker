CREATE OR REPLACE FUNCTION get_tables()
RETURNS SETOF text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT table_name::text
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
END;
$$; 