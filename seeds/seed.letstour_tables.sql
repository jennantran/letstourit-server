BEGIN;

TRUNCATE
  tour_users,
  save_tour_favorites
  RESTART IDENTITY CASCADE;

INSERT INTO tour_users (username, password)
VALUES
    ('jennantran','$2a$12$5IzM0iAWkSzN.tuzA7gOfuAaUshNP6M2Qa8yZitgeBEItE0IS1J3m'),
    ('jenna','$2a$12$5TQsK3jfd.KV/vud2UT.x.q5ybE89vF1UBkmjHLqWKggDh4XKWe2S'),
    ('jennan','$2a$12$zUAGXA5q7M/Yp.1LNqQv/.80XuaAcEzOip3DCtjG0QDNV5tLWw8ui');


INSERT INTO save_tour_favorites (place_id, name, rating, address, user_id)
VALUES 
    ('ChIJD9j4j9R_j4AR4Ux0kcDrJq4','Academy of Art University','3.9','79 New Montgomery St, San Francisco, CA 94105, USA', 1),
    ('ChIJawCN2HyAhYARNagMvTWlbKw','sweetgreen','4','171 2nd St San Francisco, CA 94105',2),
    ('ChIJEUwP4IeAhYARH8KUhX7fjpU','The Park Central San Francisco','4.2','50 3rd St, San Francisco, CA 94103',3);
COMMIT;