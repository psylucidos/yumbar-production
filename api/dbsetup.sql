CREATE TABLE yumbarusers (
  id SERIAL PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE productiondays (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
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
  flavour text NOT NULL,
  slabbatch integer NOT NULL,
  basebatch integer NOT NULL,
  secondbasebatch integer,
  slabamount integer NOT NULL,
  notes text
);

CREATE TABLE packingflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavour text NOT NULL,
  batchnumber integer NOT NULL,
  slabamount integer NOT NULL,
  boxamount integer NOT NULL,
  smallboxamount integer NOT NULL,
  usebydate date,
  sampleamount integer NOT NULL,
  leftoverbaramount integer NOT NULL,
  notes text
);

CREATE TABLE baseflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavour text NOT NULL,
  blenderamount integer NOT NULL,
  batchnumber integer NOT NULL,
  smallamount integer NOT NULL,
  largeamount integer NOT NULL,
  smallcakeamount integer NOT NULL,
  mediumcakeamount integer NOT NULL,
  largecakeamount integer NOT NULL,
  notes text
);

CREATE TABLE icecreamflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavour text NOT NULL,
  batchnumber integer NOT NULL,
  jugsamount real NOT NULL,
  traysamount integer NOT NULL,
  unsaleableweight integer NOT NULL,
  notes text
);

CREATE TABLE icecreamcakeflavourentries (
  id SERIAL PRIMARY KEY,
  productiondate date NOT NULL,
  flavour text[3] NOT NULL,
  batchnumber integer NOT NULL,
  jugsamount real[3] NOT NULL,
  smallcakesamount integer NOT NULL,
  mediumcakesamount integer NOT NULL,
  largecakesamount integer NOT NULL,
  unsaleableweight integer NOT NULL,
  notes text
);

CREATE TABLE staffnames (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE flavournames (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);
