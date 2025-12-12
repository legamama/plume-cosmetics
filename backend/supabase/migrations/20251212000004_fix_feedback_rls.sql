-- Fix RLS policies for product_feedbacks
-- Allow authenticated users (admin) to read ALL feedbacks, not just active ones

-- Drop the restrictive public select policy
DROP POLICY IF EXISTS "Public can read active feedbacks" ON product_feedbacks;

-- Create new policies: public reads active only, authenticated reads all
CREATE POLICY "Public can read active feedbacks"
    ON product_feedbacks FOR SELECT
    TO anon
    USING (is_active = true);

CREATE POLICY "Authenticated users can read all feedbacks"
    ON product_feedbacks FOR SELECT
    TO authenticated
    USING (true);
