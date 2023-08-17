CREATE SCHEMA IF NOT exists accounting;

CREATE TABLE accounting.users (
	public_id uuid NOT NULL UNIQUE,
	login varchar NOT NULL,
	role varchar NOT NULL
);

CREATE TABLE accounting.tasks (
	public_id uuid NOT NULL UNIQUE,
	description text,
	price1 money,
	price2 money
);

CREATE TABLE accounting.log (
	id serial NOT NULL,
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"user" uuid NOT NULL,
	task uuid NOT NULL,
	created timestamp NOT NULL,
	price money
)

CREATE TABLE accounting.account (
	id serial NOT NULL,
	public_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"user" uuid NOT NULL,
	"date" date NOT NULL DEFAULT current_date,
	balance_start money DEFAULT 0,
	balance_end money,
	pay money
)
