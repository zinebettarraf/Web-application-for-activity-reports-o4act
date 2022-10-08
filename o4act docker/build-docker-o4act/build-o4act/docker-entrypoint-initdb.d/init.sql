--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: rapport; Type: TABLE; Schema: public; Owner: orka
--

CREATE TABLE public.rapport (
    idr integer NOT NULL,
    username character varying(255) NOT NULL,
    date date without time zone NOT NULL,
    rd_date timestamp without time zone NOT NULL,
    task text,
    motifretard text
);


ALTER TABLE public.rapport OWNER TO orka;

--
-- Name: rapport_idr_seq; Type: SEQUENCE; Schema: public; Owner: orka
--

CREATE SEQUENCE public.rapport_idr_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rapport_idr_seq OWNER TO orka;

--
-- Name: rapport_idr_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: orka
--

ALTER SEQUENCE public.rapport_idr_seq OWNED BY public.rapport.idr;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: orka
--

CREATE TABLE public.utilisateur (
    username character varying(255) NOT NULL,
    password character varying(255),
    role integer
);


ALTER TABLE public.utilisateur OWNER TO orka;


--
-- Name: rapport idr; Type: DEFAULT; Schema: public; Owner: orka
--

ALTER TABLE ONLY public.rapport ALTER COLUMN idr SET DEFAULT nextval('public.rapport_idr_seq'::regclass);


--
-- Data for Name: rapport; Type: TABLE DATA; Schema: public; Owner: orka
--

COPY public.rapport (idr, username, date, rd_date, task, motifretard) FROM stdin;
\.




--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: orka
--

COPY public.utilisateur (username, password, role) FROM stdin;
ludovic	ludovic	1
\.


--
-- Name: rapport_idr_seq; Type: SEQUENCE SET; Schema: public; Owner: orka
--

SELECT pg_catalog.setval('public.rapport_idr_seq', 1, false);

--
-- Name: rapport rapport_pkey; Type: CONSTRAINT; Schema: public; Owner: orka
--

ALTER TABLE ONLY public.rapport
    ADD CONSTRAINT rapport_pkey PRIMARY KEY (idr);


--
-- Name: utilisateur utilisateur_password_key; Type: CONSTRAINT; Schema: public; Owner: orka
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_password_key UNIQUE (password);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: orka
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (username);


--
-- Name: rapport username; Type: FK CONSTRAINT; Schema: public; Owner: orka
--

ALTER TABLE ONLY public.rapport
    ADD CONSTRAINT username FOREIGN KEY (username) REFERENCES public.utilisateur(username);


--
-- PostgreSQL database dump complete
--
