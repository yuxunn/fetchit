ALTER TABLE documents DROP CONSTRAINT documents_visibility_check;

ALTER TABLE documents ADD CONSTRAINT documents_visibility_check 
CHECK (visibility = ANY (ARRAY['public', 'administrators-only', 'administrators-volunteers']));

UPDATE documents SET visibility = 'administrators-only' WHERE visibility = 'admins-only';
UPDATE documents SET visibility = 'administrators-only' WHERE visibility = 'private';