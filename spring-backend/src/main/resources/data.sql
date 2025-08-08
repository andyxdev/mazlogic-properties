-- Create some sample agents
INSERT INTO agents (name, email, phone) VALUES
('Alex Johnson', 'alex@mazlogic.com', '(555) 123-4567'),
('Sarah Williams', 'sarah@mazlogic.com', '(555) 987-6543'),
('Michael Davis', 'michael@mazlogic.com', '(555) 567-8901')
ON CONFLICT (email) DO NOTHING;

-- Create sample properties (will only run if agents were created successfully)
INSERT INTO properties (title, description, price, type, location, agent_id)
SELECT 'Modern Lakefront Home', 
       'Stunning modern home with panoramic lake views, featuring 4 bedrooms and 3 bathrooms.', 
       450000.0, 
       'sale', 
       '123 Lakeview Dr, Waterfront, CA',
       a.id
FROM agents a WHERE a.email = 'alex@mazlogic.com'
ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, price, type, location, agent_id)
SELECT 'Downtown Luxury Apartment', 
       'Upscale city living in this 2-bedroom luxury apartment with high-end finishes.', 
       2500.0, 
       'rent', 
       '456 Urban Ave, Downtown, CA',
       a.id
FROM agents a WHERE a.email = 'sarah@mazlogic.com'
ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, price, type, location, agent_id)
SELECT 'Suburban Family Home', 
       'Spacious 5-bedroom home in a quiet neighborhood, perfect for families.', 
       375000.0, 
       'sale', 
       '789 Maple St, Suburbia, CA',
       a.id
FROM agents a WHERE a.email = 'michael@mazlogic.com'
ON CONFLICT DO NOTHING;
