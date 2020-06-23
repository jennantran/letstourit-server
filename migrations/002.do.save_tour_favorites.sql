CREATE TABLE save_tour_favorites (
	place_id TEXT,
	name TEXT NOT NULL,
	rating  DECIMAL NOT NULL,
	address TEXT NOT NULL,
	user_id INTEGER
		REFERENCES tour_users(id) ON DELETE CASCADE NOT NULL
);
