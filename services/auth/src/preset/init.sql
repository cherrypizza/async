CREATE DATABASE async;

CREATE USER admin WITH PASSWORD 'admin';
ALTER USER admin WITH SUPERUSER;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT exists auth;

CREATE TABLE auth.users (
	id serial NOT NULL PRIMARY KEY,
	public_id uuid NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
	login varchar NOT NULL,
	"password" varchar NOT NULL,
	role varchar NOT NULL DEFAULT 'worker'
);