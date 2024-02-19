--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

--
-- Name: check_copies_available(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_copies_available() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT COUNT(*) FROM BOOK_COPY WHERE BOOK_COPY.BOOK_ID = NEW.BOOK_ID AND BOOK_COPY.STATUS = 'available') <= 0 THEN
        RAISE EXCEPTION 'No copies available';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_copies_available() OWNER TO postgres;

--
-- Name: copies_available(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.copies_available(b_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    TOTAL_COUNT INT;
    BORROWED INT;
    RES INT;
BEGIN
    SELECT SUM(COPIES_BOUGHT) INTO TOTAL_COUNT FROM ACQUISITION WHERE BOOK_ID = B_ID;
    SELECT COALESCE(COUNT(*), 0) INTO BORROWED FROM USER_BORROW_RELATION WHERE BOOK_ID = B_ID AND DATE_RETURNED IS NULL;
    RES := TOTAL_COUNT - BORROWED;
    RETURN RES;
END;
$$;


ALTER FUNCTION public.copies_available(b_id integer) OWNER TO postgres;

--
-- Name: fine_for_single_book(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fine_for_single_book(u_id integer, b_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    FINE INTEGER;
    KEPT_DAYS INTEGER;
BEGIN
    SELECT UBR.DATE_RETURNED - UBR.DATE_BORROWED - URP.DAYS INTO KEPT_DAYS
    FROM USER_RETURN_POLICY URP 
    JOIN USER_BORROW_RELATION UBR ON URP.USER_TYPE = TYPE_OF_USER(UBR.USER_ID) 
    WHERE UBR.USER_ID = U_ID AND UBR.BOOK_ID = B_ID;

    SELECT MIN(FS.FINE_AMOUNT) INTO FINE
    FROM FINE_STATE FS 
    WHERE KEPT_DAYS < FS.DAYS;

    RETURN COALESCE(FINE, 0);
END;
$$;


ALTER FUNCTION public.fine_for_single_book(u_id integer, b_id integer) OWNER TO postgres;

--
-- Name: fine_for_single_books(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fine_for_single_books(u_id integer, b_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    FINE INTEGER;
    KEPT_DAYS INTEGER;
BEGIN
    SELECT UBR.DATE_RETURNED - UBR.DATE_BORROWED - URP.DAYS INTO KEPT_DAYS
    FROM USER_RETURN_POLICY URP 
    JOIN USER_BORROW_RELATION UBR ON URP.USER_TYPE = TYPE_OF_USER(UBR.USER_ID) 
    WHERE UBR.USER_ID = U_ID AND UBR.BOOK_ID = B_ID;

    SELECT MIN(FS.FINE_AMOUNT) INTO FINE
    FROM FINE_STATE FS 
    WHERE KEPT_DAYS < FS.DAYS;

    RETURN COALESCE(FINE, 0);
END;
$$;


ALTER FUNCTION public.fine_for_single_books(u_id integer, b_id integer) OWNER TO postgres;

--
-- Name: total_due(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.total_due(u_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    FINE INTEGER := 0;
    MY_PAID INTEGER := 0;
    R RECORD;
BEGIN
    FOR R IN SELECT BOOK_ID FROM BOOKS
    LOOP
        FINE := FINE + FINE_FOR_SINGLE_BOOKS(U_ID, R.BOOK_ID);
    END LOOP;

    SELECT SUM(PAID) INTO MY_PAID FROM USER_TRANSACTON WHERE USER_ID = U_ID;

    RETURN FINE - COALESCE(MY_PAID, 0);
END;
$$;


ALTER FUNCTION public.total_due(u_id integer) OWNER TO postgres;

--
-- Name: type_of_user(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.type_of_user(u_id integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    U_TYPE VARCHAR(15);
BEGIN
    SELECT USER_TYPE INTO U_TYPE FROM USERS WHERE USER_ID = U_ID;
    RETURN U_TYPE;
END;
$$;


ALTER FUNCTION public.type_of_user(u_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: acquisition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acquisition (
    acquisition_table_id integer NOT NULL,
    book_id integer NOT NULL,
    date_bought date NOT NULL,
    copies_bought integer,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT acquisition_book_id_check CHECK ((book_id > 0)),
    CONSTRAINT acquisition_copies_bought_check CHECK ((copies_bought > 0))
);


ALTER TABLE public.acquisition OWNER TO postgres;

--
-- Name: acquisition_acquisition_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.acquisition_acquisition_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acquisition_acquisition_table_id_seq OWNER TO postgres;

--
-- Name: acquisition_acquisition_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.acquisition_acquisition_table_id_seq OWNED BY public.acquisition.acquisition_table_id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    author_id integer NOT NULL,
    author_name character varying(50) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: authors_author_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authors_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authors_author_id_seq OWNER TO postgres;

--
-- Name: authors_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authors_author_id_seq OWNED BY public.authors.author_id;


--
-- Name: book_author_relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_author_relation (
    book_id integer NOT NULL,
    author_id integer NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT book_author_relation_book_id_check CHECK ((book_id > 0))
);


ALTER TABLE public.book_author_relation OWNER TO postgres;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    publisher_id integer NOT NULL,
    shelf_id integer,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_book_id_seq OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    CONSTRAINT cart_book_id_check CHECK ((book_id > 0))
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category character varying(50) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_code integer NOT NULL,
    department_name character varying(50) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT departments_department_code_check CHECK ((department_code > 0))
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: fine_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fine_state (
    days integer NOT NULL,
    fine_amount integer,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT fine_state_fine_amount_check CHECK ((fine_amount > 0))
);


ALTER TABLE public.fine_state OWNER TO postgres;

--
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    level_no integer NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- Name: publishers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishers (
    publisher_id integer NOT NULL,
    publication_name character varying(50) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.publishers OWNER TO postgres;

--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publishers_publisher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publishers_publisher_id_seq OWNER TO postgres;

--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publishers_publisher_id_seq OWNED BY public.publishers.publisher_id;


--
-- Name: request_book_relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_book_relation (
    user_request_id integer NOT NULL,
    book_id integer NOT NULL,
    request_status character varying(20) DEFAULT 'Pending'::character varying,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT request_book_relation_request_status_check CHECK (((request_status)::text = ANY ((ARRAY['Pending'::character varying, 'Accepted'::character varying, 'Rejected'::character varying])::text[])))
);


ALTER TABLE public.request_book_relation OWNER TO postgres;

--
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    shelf_id integer NOT NULL,
    category character varying(50) NOT NULL,
    staff_id integer NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- Name: shelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shelves_shelf_id_seq OWNER TO postgres;

--
-- Name: shelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shelves_shelf_id_seq OWNED BY public.shelves.shelf_id;


--
-- Name: staffs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staffs (
    staff_id integer NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.staffs OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    current_level integer,
    current_term integer,
    department_code integer,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: teacher_designation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_designation (
    designation character varying(30) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.teacher_designation OWNER TO postgres;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    teacher_id integer NOT NULL,
    designation character varying(30),
    department_code integer,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: terms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terms (
    term_no integer NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.terms OWNER TO postgres;

--
-- Name: user_borrow_relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_borrow_relation (
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    date_borrowed date,
    date_returned date,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT user_borrow_relation_book_id_check CHECK ((book_id > 0))
);


ALTER TABLE public.user_borrow_relation OWNER TO postgres;

--
-- Name: user_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_request (
    user_request_id integer NOT NULL,
    user_id integer NOT NULL,
    request_date date NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.user_request OWNER TO postgres;

--
-- Name: user_request_user_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_request_user_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_request_user_request_id_seq OWNER TO postgres;

--
-- Name: user_request_user_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_request_user_request_id_seq OWNED BY public.user_request.user_request_id;


--
-- Name: user_return_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_return_policy (
    user_type character varying(15) NOT NULL,
    days integer,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT user_return_policy_days_check CHECK ((days > 0))
);


ALTER TABLE public.user_return_policy OWNER TO postgres;

--
-- Name: user_transacton; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_transacton (
    user_transacton_id integer NOT NULL,
    user_id integer NOT NULL,
    paid integer,
    is_visible boolean DEFAULT true NOT NULL,
    CONSTRAINT user_transacton_paid_check CHECK ((paid >= 0))
);


ALTER TABLE public.user_transacton OWNER TO postgres;

--
-- Name: user_transacton_user_transacton_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_transacton_user_transacton_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_transacton_user_transacton_id_seq OWNER TO postgres;

--
-- Name: user_transacton_user_transacton_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_transacton_user_transacton_id_seq OWNED BY public.user_transacton.user_transacton_id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_type (
    user_type character varying(15) NOT NULL,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    phone_number character varying(14) NOT NULL,
    library_password character varying(32) NOT NULL,
    user_type character varying(15)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: acquisition acquisition_table_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acquisition ALTER COLUMN acquisition_table_id SET DEFAULT nextval('public.acquisition_acquisition_table_id_seq'::regclass);


--
-- Name: authors author_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors ALTER COLUMN author_id SET DEFAULT nextval('public.authors_author_id_seq'::regclass);


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: publishers publisher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishers ALTER COLUMN publisher_id SET DEFAULT nextval('public.publishers_publisher_id_seq'::regclass);


--
-- Name: shelves shelf_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.shelves_shelf_id_seq'::regclass);


--
-- Name: user_request user_request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_request ALTER COLUMN user_request_id SET DEFAULT nextval('public.user_request_user_request_id_seq'::regclass);


--
-- Name: user_transacton user_transacton_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transacton ALTER COLUMN user_transacton_id SET DEFAULT nextval('public.user_transacton_user_transacton_id_seq'::regclass);


--
-- Name: acquisition acquisition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acquisition
    ADD CONSTRAINT acquisition_pkey PRIMARY KEY (acquisition_table_id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (author_id);


--
-- Name: book_author_relation book_author_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_author_relation
    ADD CONSTRAINT book_author_relation_pkey PRIMARY KEY (book_id, author_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (user_id, book_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_code);


--
-- Name: fine_state fine_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine_state
    ADD CONSTRAINT fine_state_pkey PRIMARY KEY (days);


--
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_no);


--
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (publisher_id);


--
-- Name: request_book_relation request_book_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_book_relation
    ADD CONSTRAINT request_book_relation_pkey PRIMARY KEY (user_request_id, book_id);


--
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (shelf_id);


--
-- Name: staffs staffs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_pkey PRIMARY KEY (staff_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- Name: teacher_designation teacher_designation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_designation
    ADD CONSTRAINT teacher_designation_pkey PRIMARY KEY (designation);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (teacher_id);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (term_no);


--
-- Name: user_borrow_relation user_borrow_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_borrow_relation
    ADD CONSTRAINT user_borrow_relation_pkey PRIMARY KEY (user_id, book_id);


--
-- Name: user_request user_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_request
    ADD CONSTRAINT user_request_pkey PRIMARY KEY (user_request_id);


--
-- Name: user_return_policy user_return_policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_return_policy
    ADD CONSTRAINT user_return_policy_pkey PRIMARY KEY (user_type);


--
-- Name: user_transacton user_transacton_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transacton
    ADD CONSTRAINT user_transacton_pkey PRIMARY KEY (user_transacton_id);


--
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (user_type);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: user_borrow_relation borrow_checker; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER borrow_checker BEFORE INSERT ON public.user_borrow_relation FOR EACH ROW EXECUTE FUNCTION public.check_copies_available();


--
-- Name: acquisition acquisition_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acquisition
    ADD CONSTRAINT acquisition_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: book_author_relation book_author_relation_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_author_relation
    ADD CONSTRAINT book_author_relation_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(author_id);


--
-- Name: book_author_relation book_author_relation_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_author_relation
    ADD CONSTRAINT book_author_relation_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: books books_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_fkey FOREIGN KEY (category) REFERENCES public.categories(category);


--
-- Name: books books_publisher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(publisher_id);


--
-- Name: books books_shelf_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_shelf_id_fkey FOREIGN KEY (shelf_id) REFERENCES public.shelves(shelf_id);


--
-- Name: cart cart_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: request_book_relation request_book_relation_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_book_relation
    ADD CONSTRAINT request_book_relation_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: request_book_relation request_book_relation_user_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_book_relation
    ADD CONSTRAINT request_book_relation_user_request_id_fkey FOREIGN KEY (user_request_id) REFERENCES public.user_request(user_request_id);


--
-- Name: shelves shelves_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_category_fkey FOREIGN KEY (category) REFERENCES public.categories(category);


--
-- Name: shelves shelves_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staffs(staff_id);


--
-- Name: staffs staffs_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.users(user_id);


--
-- Name: students students_current_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_current_level_fkey FOREIGN KEY (current_level) REFERENCES public.levels(level_no);


--
-- Name: students students_current_term_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_current_term_fkey FOREIGN KEY (current_term) REFERENCES public.terms(term_no);


--
-- Name: students students_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(department_code);


--
-- Name: students students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(user_id);


--
-- Name: teachers teachers_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(department_code);


--
-- Name: teachers teachers_designation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_designation_fkey FOREIGN KEY (designation) REFERENCES public.teacher_designation(designation);


--
-- Name: teachers teachers_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(user_id);


--
-- Name: user_borrow_relation user_borrow_relation_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_borrow_relation
    ADD CONSTRAINT user_borrow_relation_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: user_borrow_relation user_borrow_relation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_borrow_relation
    ADD CONSTRAINT user_borrow_relation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_request user_request_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_request
    ADD CONSTRAINT user_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_return_policy user_return_policy_user_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_return_policy
    ADD CONSTRAINT user_return_policy_user_type_fkey FOREIGN KEY (user_type) REFERENCES public.user_type(user_type);


--
-- Name: user_transacton user_transacton_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_transacton
    ADD CONSTRAINT user_transacton_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: users users_user_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_type_fkey FOREIGN KEY (user_type) REFERENCES public.user_type(user_type);


--
-- PostgreSQL database dump complete
--

