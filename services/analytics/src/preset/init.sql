CREATE SCHEMA IF NOT exists analytics;

CREATE TABLE analytics.users (
	public_id uuid NOT NULL UNIQUE,
	login varchar NOT NULL,
	role varchar NOT NULL
);

CREATE TABLE analytics.tasks (
	public_id uuid NOT NULL UNIQUE,
	description text,
	price1 money,
	price2 money
);

CREATE TABLE analytics.log (
	public_id uuid NOT NULL UNIQUE,
	"user" uuid NOT NULL,
	task uuid NOT NULL,
	created timestamp NOT NULL,
	price money
)

CREATE TABLE analytics.account (
	public_id uuid NOT NULL UNIQUE,
	"user" uuid NOT NULL,
	"date" date NOT NULL,
	balance_start money,
	balance_end money,
	pay money
)