CREATE SCHEMA IF NOT exists tasks;

CREATE TABLE tasks.users (
	public_id uuid NOT NULL UNIQUE,
	login varchar NOT NULL,
	role varchar NOT NULL
);

CREATE TABLE tasks.tasks (
	id serial NOT NULL PRIMARY KEY,
	public_id uuid NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
	description text,
	executor uuid NOT NULL,
	price1 money,
	price2 money,
  "isClosed" boolean
);