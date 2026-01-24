CREATE TABLE rooms(
	room_id int PRIMARY KEY,
	room_number int,
	room_capacity int,
	room_type varchar(10),
	room_price float
);

CREATE TABLE clients(
	client_id int PRIMARY KEY,
	client_surname varchar(25),
	client_name varchar(25),
	client_second_name varchar(25),
	client_age int,
	client_info varchar(100)
);

CREATE TABLE bookings(
	booking_id int PRIMARY KEY,
	client_id int,
	room_id int,
	check_in_date date,
	check_out_date date,
	FOREIGN KEY (client_id) REFERENCES clients(client_id),
	FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

ALTER TABLE bookings ADD COLUMN room_stay_duration double precision;
UPDATE bookings SET room_stay_duration = check_out_date - check_in_date;

INSERT INTO rooms (room_id, room_number, room_capacity, room_type, room_price) VALUES
(1, 101, 2, 'обычный', 2500.00),
(2, 102, 2, 'обычный', 2500.00),
(3, 103, 3, 'обычный', 3500.00),
(4, 201, 2, 'полулюкс', 6000.00),
(5, 202, 2, 'полулюкс', 7000.00),
(6, 301, 2, 'люкс', 10000.00),
(7, 302, 4, 'люкс', 14000.00),
(8, 303, 2, 'полулюкс', 7500.00);

INSERT INTO clients (client_id, client_surname, client_name, client_second_name, client_age, client_info) VALUES
(1, 'Иванов', 'Петр', 'Сергеевич', 65, 'Постоянный клиент'),
(2, 'Петрова', 'Мария', 'Ивановна', 28, 'Туристическая группа'),
(3, 'Сидоров', 'Алексей', 'Алексеевич', 53, 'Командировка'),
(4, 'Козлова', 'Елена', 'Викторовна', 41, 'Семейный отдых'),
(5, 'Николаев', 'Дмитрий', 'Олегович', 25, 'Молодожены'),
(6, 'Федорова', 'Анна', 'Петровна', 28, 'Деловая поездка'),
(7, 'Морозов', 'Сергей', 'Васильевич', 45, 'Групповое бронирование'),
(8, 'Волкова', 'Ольга', 'Дмитриевна', 89, 'Отдых в одиночку'),
(9, 'Орлов', 'Иван', 'Николаевич', 33, 'Семинар'),
(10, 'Лебедева', 'Светлана', 'Алексеевна', 19, 'Транзит');

ALTER TABLE clients ALTER COLUMN client_age TYPE double precision;

INSERT INTO bookings (booking_id, client_id, room_id, check_in_date, check_out_date) VALUES
(1, 1, 1, '2024-01-10', '2024-01-24'),
(2, 2, 7, '2024-01-12', '2024-01-20'),
(3, 3, 4, '2024-03-14', '2024-03-16'),
(4, 4, 3, '2024-05-15', '2024-05-22'),
(5, 5, 6, '2024-05-18', '2024-05-20'),
(6, 6, 2, '2024-07-20', '2024-07-25'),
(7, 7, 5, '2024-07-23', '2024-07-29'),
(8, 1, 8, '2024-08-25', '2024-08-30');

SELECT * FROM rooms;
SELECT * FROM clients;
SELECT * FROM bookings;

DROP TABLE rooms;
DROP TABLE clients;
DROP TABLE bookings;

CREATE OR REPLACE FUNCTION z_days_low(x double precision, a double precision, b double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 1;
    ELSIF x >= b THEN
        RETURN 0;
    ELSE
        RETURN (b - x) / (b - a);
    END IF;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_days_mid(x double precision, a double precision, b double precision, c double precision, d double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x < a OR x > d THEN
        RETURN 0;
    ELSIF x >= b AND x <= c THEN
        RETURN 1;
    ELSIF x >= a AND x < b THEN
        RETURN (x - a) / (b - a);
    ELSE
        RETURN (d - x) / (d - c);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_days_high(x double precision, a double precision, b double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 0;
    ELSIF x >= b THEN
        RETURN 1;
    ELSE
        RETURN (x - a) / (b - a);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_age_low(x double precision, a double precision, b double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 1;
    ELSIF x >= b THEN
        RETURN 0;
    ELSE
        RETURN (b - x) / (b - a);
    END IF;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_age_mid(x double precision, a double precision, b double precision, c double precision, d double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a OR x >= d THEN
        RETURN 0;
    ELSIF x >= b AND x <= c THEN
        RETURN 1;
    ELSIF x > a AND x < b THEN
        RETURN (x - a) / (b - a);
    ELSE
        RETURN (d - x) / (d - c);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_age_high(x double precision, a double precision, b double precision)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 0;
    ELSIF x >= b THEN
        RETURN 1;
    ELSE
        RETURN (x - a) / (b - a);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_room_low(x float, a float, b float)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 1;
    ELSIF x >= b THEN
        RETURN 0;
    ELSE
        RETURN (b - x) / (b - a);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_room_mid(x float, a float, b float, c float, d float)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a OR x >= d THEN
        RETURN 0;
    ELSIF x >= b AND x <= c THEN
        RETURN 1;
    ELSIF x > a AND x < b THEN
        RETURN (x - a) / (b - a);
    ELSE
        RETURN (d - x) / (d - c);
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION z_room_high(x float, a float, b float)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    IF x <= a THEN
        RETURN 0;
    ELSIF x >= b THEN
        RETURN 1;
    ELSE
        RETURN (x - a) / (b - a);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Возраст клиента
CREATE OR REPLACE FUNCTION fage(attrib double precision, term VARCHAR(25))
RETURNS DOUBLE PRECISION AS $$
BEGIN
CASE term
WHEN 'Молодой' THEN RETURN z_age_low(attrib, 24, 30);
WHEN 'Средний' THEN RETURN z_age_mid(attrib, 25, 35, 50, 65);
WHEN 'Пожилой' THEN RETURN z_age_high(attrib, 60, 75);
END CASE;
END;
$$ LANGUAGE plpgsql;

-- Дороговизна номера
CREATE OR REPLACE FUNCTION froom(attrib double precision, term VARCHAR(25))
RETURNS DOUBLE PRECISION AS $$
BEGIN
CASE term
WHEN 'Дешёвый' THEN RETURN z_room_low(attrib, 2000, 4000);
WHEN 'Средний' THEN RETURN z_room_mid(attrib, 3500, 7000, 9000, 11000);
WHEN 'Дорогой' THEN RETURN z_room_high(attrib, 9000, 13000);
END CASE;
END;
$$ LANGUAGE plpgsql;

-- Срок проживания
CREATE OR REPLACE FUNCTION fdays(attrib double precision, term VARCHAR(25))
RETURNS DOUBLE PRECISION AS $$
BEGIN
CASE term
WHEN 'Малый' THEN RETURN z_days_low(attrib, 2, 4);
WHEN 'Средний' THEN RETURN z_days_mid(attrib, 3, 5, 7, 9);
WHEN 'Длительный' THEN RETURN z_days_high(attrib, 7, 14);
END CASE;
END;
$$ LANGUAGE plpgsql;

--Индекс соответствия (CI) и нечеткие запросы
CREATE OR REPLACE FUNCTION calculate_ci(degree1 DOUBLE PRECISION, degree2 DOUBLE PRECISION)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN LEAST(degree1, degree2);
END;
$$ LANGUAGE plpgsql;

SELECT *, fdays(room_stay_duration, 'Малый') FROM bookings
WHERE fdays(room_stay_duration, 'Малый')>0;

SELECT *, fdays(room_stay_duration, 'Средний') FROM bookings
WHERE fdays(room_stay_duration, 'Средний')>0;

SELECT *, fdays(room_stay_duration, 'Длительный') FROM bookings
WHERE fdays(room_stay_duration, 'Длительный')>0;

SELECT *, froom(room_price, 'Дешёвый') FROM rooms
WHERE froom(room_price, 'Дешёвый')>0;

SELECT *, froom(room_price, 'Средний') FROM rooms
WHERE froom(room_price, 'Средний')>0;

SELECT *, froom(room_price, 'Дорогой') FROM rooms
WHERE froom(room_price, 'Дорогой')>0;

SELECT *, fage(client_age, 'Молодой') FROM clients
WHERE fage(client_age, 'Молодой')>0;

SELECT *, fage(client_age, 'Средний') FROM clients
WHERE fage(client_age, 'Средний')>0;

SELECT *, fage(client_age, 'Пожилой') FROM clients
WHERE fage(client_age, 'Пожилой')>0;

SELECT *, calculate_ci(fdays(room_stay_duration, 'Длительный'), fage(client_age, 'Пожилой')) FROM
bookings JOIN clients ON bookings.client_id = clients.client_id
WHERE calculate_ci(fdays(room_stay_duration, 'Длительный'), fage(client_age, 'Пожилой'))>0;

SELECT *, calculate_ci(fdays(room_stay_duration, 'Длительный'), fage(client_age, 'Молодой')) FROM
bookings JOIN clients ON bookings.client_id = clients.client_id
WHERE calculate_ci(fdays(room_stay_duration, 'Длительный'), fage(client_age, 'Молодой'))>0;

SELECT *, calculate_ci(froom(room_price, 'Дорогой'), fage(client_age, 'Молодой')) FROM
bookings JOIN clients ON bookings.client_id = clients.client_id 
JOIN rooms ON bookings.room_id = rooms.room_id
WHERE calculate_ci(froom(room_price, 'Дорогой'), fage(client_age, 'Молодой'))>0;

SELECT *, calculate_ci(froom(room_price, 'Дешёвый'), fage(client_age, 'Молодой')) FROM
bookings JOIN clients ON bookings.client_id = clients.client_id 
JOIN rooms ON bookings.room_id = rooms.room_id
WHERE calculate_ci(froom(room_price, 'Дешёвый'), fage(client_age, 'Молодой'))>0;

SELECT *, least(fdays(room_stay_duration, 'Средний'), fage(client_age, 'Средний'), froom(room_price, 'Средний')) FROM
bookings JOIN clients ON bookings.client_id = clients.client_id 
JOIN rooms ON bookings.room_id = rooms.room_id
WHERE least(fdays(room_stay_duration, 'Средний'), fage(client_age, 'Средний'), froom(room_price, 'Средний'))>0;
