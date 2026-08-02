-- Seed a few live "I want to play" heartbeats (near Mumbai default location).
-- Run in Supabase SQL Editor after 001_discovery.sql.
insert into public.heartbeats
  (user_name, user_username, user_avatar, verified, type, sport, skill_level, location, latitude, longitude, note, is_active, expires_at, created_at)
values
  ('Rahul Sharma','rahul_sharma','',true,'i-want-to-play','football','intermediate','Andheri west',19.1136,72.8697,'Up for a 5v5 this evening after 6 PM.',true, now()+interval '3 hours', now()-interval '4 minutes'),
  ('Priya Patel','priya_patel','',true,'i-want-to-play','badminton','beginner','Powai',19.1176,72.906,'Looking for a doubles partner this weekend.',true, now()+interval '5 hours', now()-interval '9 minutes'),
  ('Arjun Nair','arjun_nair','',true,'i-want-to-play','box-cricket','advanced','Bandra',19.0544,72.8302,'Ready for a night match. Proper gear.',true, now()+interval '2 hours', now()-interval '15 minutes'),
  ('Sneha Reddy','sneha_reddy','',false,'i-want-to-play','pickleball','intermediate','Juhu',19.0883,72.8265,'Casual pickleball, anyone nearby?',true, now()+interval '4 hours', now()-interval '22 minutes');