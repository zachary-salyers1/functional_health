-- ============================================================================
-- CREATE STORAGE BUCKET FOR LAB UPLOADS
-- ============================================================================

-- Create the storage bucket for lab PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('lab-uploads', 'lab-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload their own files
CREATE POLICY "Users can upload their own lab files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lab-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read their own lab files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lab-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own lab files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lab-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
