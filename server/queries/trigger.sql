CREATE OR REPLACE FUNCTION check_copies_available()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM BOOK_COPY WHERE BOOK_COPY.BOOK_ID = NEW.BOOK_ID AND BOOK_COPY.STATUS = 'available') <= 0 THEN
        RAISE EXCEPTION 'No copies available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER BORROW_CHECKER
BEFORE INSERT
ON USER_BORROW_RELATION
FOR EACH ROW
EXECUTE FUNCTION check_copies_available();  

--NEW FUNCTION


CREATE OR REPLACE FUNCTION insert_student_info()
RETURNS TRIGGER AS $$
DECLARE
    d_code INTEGER;
    flag INTEGER := 0;
    r RECORD;
BEGIN
    IF NEW.user_type = 'Student' THEN
        d_code := (NEW.user_id / 1000)::INTEGER % 100;
        FOR r IN SELECT * FROM department LOOP
            IF r.department_code = d_code THEN
                flag := 1;
                EXIT;
            END IF;
        END LOOP;

        IF flag = 0 THEN
            RAISE EXCEPTION 'Invalid Department Code';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_student_info_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION insert_student_info();

--NEW TRIGGER

CREATE OR REPLACE FUNCTION user_transaction_checker()
RETURNS TRIGGER AS $$
DECLARE
    d_amount NUMERIC;
BEGIN
    SELECT TOTAL_DUE(NEW.USER_ID) INTO d_amount;

    IF NEW.PAID > d_amount THEN
        
        RAISE EXCEPTION 'Amount paid is greater than due';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_transaction_trigger
BEFORE INSERT ON USER_TRANSACTON
FOR EACH ROW
EXECUTE FUNCTION user_transaction_checker();

CREATE OR REPLACE FUNCTION book_searched_trigger_function() RETURNS TRIGGER AS $$
DECLARE
    t_index INTEGER;
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM BOOK_SEARCHED;
    SELECT MIN(SEARCHED_INDEX) INTO t_index FROM BOOK_SEARCHED;
    
    IF row_count > 1000 THEN
        DELETE FROM BOOK_SEARCHED WHERE SEARCHED_INDEX = t_index;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER book_searched_trigger
AFTER INSERT ON BOOK_SEARCHED
FOR EACH ROW
EXECUTE FUNCTION book_searched_trigger_function();


-- Ensure pgcrypto extension is installed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Assume you have a table named "library" with columns including "library_password"
CREATE OR REPLACE FUNCTION encrypt_password()
RETURNS TRIGGER AS $$
BEGIN
  NEW.library_password = crypt(NEW.library_password, gen_salt('bf'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER encrypt_password_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION encrypt_password();