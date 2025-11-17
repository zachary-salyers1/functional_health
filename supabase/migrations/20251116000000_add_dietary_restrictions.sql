-- Add dietary restrictions to user_preferences table
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS dietary_restrictions JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN user_preferences.dietary_restrictions IS 'Array of dietary restrictions/preferences (e.g., ["vegetarian", "gluten-free", "dairy-free", "vegan", "pescatarian", "keto", "paleo", "low-carb", "nut-allergy", "shellfish-allergy"])';

-- Update existing rows to have empty array if null
UPDATE user_preferences
SET dietary_restrictions = '[]'::jsonb
WHERE dietary_restrictions IS NULL;
