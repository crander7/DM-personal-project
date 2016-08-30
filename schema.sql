CREATE TABLE file_status
(
  file_status_id SERIAL PRIMARY KEY,
  status VARCHAR(40)
);

INSERT INTO file_status (status) VALUES ('single');
INSERT INTO file_status (status) VALUES ('married-filing-jointly');
INSERT INTO file_status (status) VALUES ('married-filing-separately');
INSERT INTO file_status (status) VALUES ('head-of-household');

CREATE TABLE tax_rates
(
  tax_rates_id SERIAL PRIMARY KEY,
  rate_name VARCHAR(40),
  rate_val NUMERIC(4,3)
);

INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.10);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.15);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.25);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.28);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.33);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.35);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('federalIncomeTax', 0.396);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('selfEmploymentTax', 0.153);
INSERT INTO tax_rates (rate_name, rate_val) VALUES ('medicareTax', 0.029);

CREATE TABLE brackets
(
  brackets_id SERIAL PRIMARY KEY,
  bottom NUMERIC(9, 2),
  top NUMERIC(10, 2),
  plus NUMERIC(9, 2),
  status_id INTEGER REFERENCES file_status(file_status_id),
  rate_id INTEGER REFERENCES tax_rates(tax_rates_id)
);

INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (0.00, 9275.00, 0.0, 1, 1);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (9276.00, 37650.00, 927.50, 1, 2);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (37651.00, 91150.00, 5183.75, 1, 3);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (91151.00, 190150.00, 18558.75, 1, 4);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (190151.00, 413350.00, 46278.75, 1, 5);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (413351.00, 415050.00, 119934.75, 1, 6);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (415051.00, 99999999.99, 120529.75, 1, 7);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (0.00, 18550.00, 0.0, 2, 1);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (18551.00, 75300.00, 1855.00, 2, 2);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (75301.00, 151900.00, 10367.50, 2, 3);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (151901.00, 231450.00, 29517.50, 2, 4);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (231451.00, 413350.00, 51791.50, 2, 5);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (413351.00, 466950.00, 111818.50, 2, 6);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (466951.00, 99999999.99, 130578.50, 2, 7);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (0.00, 9275.00, 0.0, 3, 1);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (9276.00, 37650.00, 927.50, 3, 2);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (37651.00, 75950.00, 5183.75, 3, 3);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (75951.00, 115725.00, 14758.75, 3, 4);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (115726.00, 206675.00, 25895.75, 3, 5);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (206676.00, 233475.00, 55909.25, 3, 6);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (233476.00, 99999999.99, 65289.25, 3, 7);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (0.00, 13250.00, 0.0, 4, 1);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (13251.00, 50400.00, 1325.00, 4, 2);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (50401.00, 130150.00, 6897.50, 4, 3);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (130151.00, 210800.00, 26835.00, 4, 4);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (210801.00, 413350.00, 49471.00, 4, 5);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (413351.00, 441000.00, 116258.50, 4, 6);
INSERT INTO brackets (bottom, top, plus, status_id, rate_id) VALUES (441001.00, 99999999.99, 125936.00, 4, 7);

CREATE TABLE std_deductions
(
  std_deductions_id SERIAL PRIMARY KEY,
  std_deduction_name VARCHAR (40),
  std_deduction NUMERIC(8, 2),
  status_id INTEGER REFERENCES file_status(file_status_id)
);

INSERT INTO std_deductions (std_deduction_name, std_deduction, status_id) VALUES ('standardDeduction', 6300.00, 1);
INSERT INTO std_deductions (std_deduction_name, std_deduction, status_id) VALUES ('standardDeduction', 12600.00, 2);
INSERT INTO std_deductions (std_deduction_name, std_deduction, status_id) VALUES ('standardDeduction', 6300.00, 3);
INSERT INTO std_deductions (std_deduction_name, std_deduction, status_id) VALUES ('standardDeduction', 9300.00, 4);

CREATE TABLE tax_limits
(
  tax_limits_id SERIAL PRIMARY KEY,
  limit_name VARCHAR(40),
  limit_value NUMERIC(8, 2)
);

INSERT INTO tax_limits (limit_name, limit_value) VALUES ('personalExemption', 4050.00);
INSERT INTO tax_limits (limit_name, limit_value) VALUES ('socialSecurityWageLimit', 118500.00);
INSERT INTO tax_limits (limit_name, limit_value) VALUES ('socialSecuritySelfEmploymentLimit', 14694.00);

CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    type VARCHAR(10),
    email VARCHAR(60),
    fb_id VARCHAR(40)
);

INSERT INTO users (name, type, email, fb_id) VALUES ('Craig M Andersen', 'admin', 'andersen.craigm@gmail.com', '10101273018848754');
