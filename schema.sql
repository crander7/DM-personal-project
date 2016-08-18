CREATE TABLE file_status
(
  file_status_id SERIAL PRIMARY KEY,
  status VARCHAR(40)
);

INSERT INTO file_status (status) VALUES ('Single');
INSERT INTO file_status (status) VALUES ('Married Filing Jointly');
INSERT INTO file_status (status) VALUES ('Married Filing Separately');
INSERT INTO file_status (status) VALUES ('Head of Household');

CREATE TABLE tax_rates
(
  tax_rates_id SERIAL PRIMARY KEY,
  rate_name VARCHAR(40),
  rate NUMERIC(4,3)
);

INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.10);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.15);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.25);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.28);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.33);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.35);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Federal Income Tax", 0.396);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Self Employment Tax", 0.153);
INSERT INTO tax_rates (rate_name, rate) VALUES ("Medicaid Tax", 0.029);

CREATE TABLE brackets
(
  brackets_id SERIAL PRIMARY KEY,
  rate NUMERIC(5, 4),
  bottom NUMERIC(9, 2),
  top NUMERIC(10, 2),
  status_id INTEGER REFERENCES file_status,
  rate_id INTEGER REFERENCES tax_rates
);

INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (0.00, 9275.00, 1, 1);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (9276.00, 37650.00, 1, 2);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (37651.00, 91150.00, 1, 3);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (91151.00, 190150.00, 1, 4);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (190151.00, 413350.00, 1, 5);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (413351.00, 415050.00, 1, 6);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (415051.00, 99999999.99, 1, 7);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (0.00, 18550.00, 2, 1);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (18551.00, 75300.00, 2, 2);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (75301.00, 151900.00, 2, 3);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (151901.00, 231450.00, 2, 4);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (231451.00, 413350.00, 2, 5);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (413351.00, 466950.00, 2, 6);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (466951.00, 99999999.99, 2, 7);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (0.00, 9275.00, 3, 1);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (9276.00, 37650.00, 3, 2);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (37651.00, 75950.00, 3, 3);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (759501.00, 115725.00, 3, 4);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (115726.00, 206675.00, 3, 5);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (206676.00, 233475.00, 3, 6);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (233476.00, 99999999.99, 3, 7);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (0.00, 13250.00, 4, 1);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (13251.00, 50400.00, 4, 2);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (50401.00, 130150.00, 4, 3);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (130151.00, 210800.00, 4, 4);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (210801.00, 413350.00, 4, 5);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (413351.00, 441000.00, 4, 6);
INSERT INTO brackets (bottom, top, status_id, rate_id) VALUES (441001.00, 99999999.99, 4, 7);

CREATE TABLE std_deductions
(
  std_deductions_id SERIAL PRIMARY KEY,
  std_deduction NUMERIC(8, 2),
  status_id INTEGER REFERENCES file_status
);

INSERT INTO std_deductions (std_deduction, status_id) VALUES (6300.00, 1);
INSERT INTO std_deductions (std_deduction, status_id) VALUES (12600.00, 2);
INSERT INTO std_deductions (std_deduction, status_id) VALUES (6300.00, 3);
INSERT INTO std_deductions (std_deduction, status_id) VALUES (9300.00, 4);

CREATE TABLE tax_limits
(
  tax_limits_id SERIAL PRIMARY KEY,
  limit_name VARCHAR(40),
  limit_value NUMERIC(8, 2)
);

INSERT INTO tax_limits (limit_name, limit_value) VALUES ("Personal Exemption", 4050.00);
INSERT INTO tax_limits (limit_name, limit_value) VALUES ("Social Security wage limit", 118500.00);
INSERT INTO tax_limits (limit_name, limit_value) VALUES ("Social Security Self Employment limit", 14694.00);
