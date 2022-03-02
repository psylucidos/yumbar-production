CREATE TABLE yumbarusers (
  id SERIAL PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE productiondays (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL UNIQUE,
  productiontype text NOT NULL
);

CREATE TABLE staffentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  name text NOT NULL,
  starttime text NOT NULL,
  endtime text NOT NULL,
  breaklength smallint NOT NULL
);

CREATE TABLE cuttingflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavor text NOT NULL,
  slabbatch integer NOT NULL,
  basebatch integer NOT NULL,
  slabamount integer NOT NULL,
  boxamount integer NOT NULL,
  notes text NOT NULL
);

CREATE TABLE packingflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavor text NOT NULL,
  batchnumber integer NOT NULL,
  slabamount integer NOT NULL,
  boxamount integer NOT NULL,
  usebydate date NOT NULL,
  sampleamount integer NOT NULL,
  notes text NOT NULL
);

CREATE TABLE baseflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavor text NOT NULL,
  blenderamount integer NOT NULL,
  batchnumber integer NOT NULL,
  smallamount integer NOT NULL,
  largeamount integer NOT NULL,
  smallcakeamount integer NOT NULL,
  mediumcakeamount integer NOT NULL,
  largecakeamount integer NOT NULL,
  notes text NOT NULL
);

CREATE TABLE icecreamflavorentires (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavor text NOT NULL,
  batchnumber integer NOT NULL,
  jugsamount integer NOT NULL,
  traysamount integer NOT NULL,
  unsaleabletraysamount integer NOT NULL,
  notes text NOT NULL
);
