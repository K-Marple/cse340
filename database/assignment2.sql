-- Create account record for Tony Stark
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Make Tony an admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Delete Tony from the table
DELETE FROM public.account
WHERE account_id = 1;
-- Update GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Select make and model of 'Sport' classification vehicles
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';
-- Update image and thumbnail to have /vehicles in the path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 's/', 's/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 's/', 's/vehicles/');