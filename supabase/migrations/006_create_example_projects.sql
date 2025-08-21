-- Migration 006: Create Example Projects
-- This creates sample projects that are marked as public for all users to see

-- First, let's get a user ID to assign as the owner of example projects
-- We'll use the first user in the system, or create a placeholder if none exists
DO $$
DECLARE
    example_owner_id uuid;
BEGIN
    -- Get the first user in the system
    SELECT id INTO example_owner_id 
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1;
    
    -- If no users exist, we'll use a placeholder (this shouldn't happen in practice)
    IF example_owner_id IS NULL THEN
        RAISE EXCEPTION 'No users found in auth.users. Please ensure at least one user exists.';
    END IF;

    -- Insert example projects
    INSERT INTO public.projects (
        title,
        description,
        slug,
        is_public,
        owner_id,
        created_at,
        updated_at
    ) VALUES 
    (
        'Getting Started Guide',
        'A comprehensive guide to help you get started with Notefluence. Learn the basics of creating projects, adding content, and collaborating with others.',
        'getting-started-guide',
        true,
        example_owner_id,
        NOW(),
        NOW()
    ),
    (
        'API Documentation',
        'Complete API documentation with examples, endpoints, and best practices for integrating with Notefluence.',
        'api-documentation',
        true,
        example_owner_id,
        NOW(),
        NOW()
    ),
    (
        'Data Analysis Project',
        'A sample data analysis project demonstrating how to use Notefluence for research, data visualization, and collaborative analysis.',
        'data-analysis-project',
        true,
        example_owner_id,
        NOW(),
        NOW()
    ),
    (
        'Product Roadmap',
        'Example product roadmap showing how to organize features, track progress, and collaborate with stakeholders.',
        'product-roadmap',
        true,
        example_owner_id,
        NOW(),
        NOW()
    ),
    (
        'Research Notes',
        'Sample research project demonstrating note-taking, source management, and collaborative research workflows.',
        'research-notes',
        true,
        example_owner_id,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO NOTHING; -- Don't insert if slug already exists

    RAISE NOTICE 'Example projects created successfully with owner_id: %', example_owner_id;
END $$;
