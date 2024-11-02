-- Generado por Oracle SQL Developer Data Modeler 21.2.0.183.1957
--   en:        2024-11-01 20:43:59 CLST
--   sitio:      Oracle Database 11g
--   tipo:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE address (
    id           NUMBER(20) NOT NULL,
    streetname   VARCHAR2(100) NOT NULL,
    streetnumber VARCHAR2(50) NOT NULL,
    idcomuna     NUMBER(20) NOT NULL
);

ALTER TABLE address ADD CONSTRAINT address_pk PRIMARY KEY ( id );

CREATE TABLE appuser (
    id             NUMBER(20) NOT NULL,
    firstname      VARCHAR2(20),
    lastname       VARCHAR2(20),
    secondlastname VARCHAR2(20),
    countrycode    VARCHAR2(3),
    numberphone    NUMBER(9),
    email          VARCHAR2(500) NOT NULL,
    password       RAW(255) NOT NULL,
    idaddress      NUMBER(20) NOT NULL,
    idcontract     NUMBER(20) NOT NULL
);

ALTER TABLE appuser ADD CONSTRAINT appuser_pk PRIMARY KEY ( id );

CREATE TABLE comuna (
    id       NUMBER(20) NOT NULL,
    name     VARCHAR2(70) NOT NULL,
    idregion NUMBER(20) NOT NULL
);

ALTER TABLE comuna ADD CONSTRAINT comuna_pk PRIMARY KEY ( id );

CREATE TABLE contract (
    id                   NUMBER(20) NOT NULL,
    serviceadmincost     NUMBER(10) NOT NULL,
    transportcost        NUMBER(10) NOT NULL,
    electricitycost      NUMBER(10) NOT NULL,
    idelectricitycompany NUMBER(20) NOT NULL
);

ALTER TABLE contract ADD CONSTRAINT contract_pk PRIMARY KEY ( id );

CREATE TABLE country (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(50) NOT NULL
);

ALTER TABLE country ADD CONSTRAINT country_pk PRIMARY KEY ( id );

CREATE TABLE device (
    id           NUMBER(20) NOT NULL,
    serialnumber VARCHAR2(20) NOT NULL,
    name         VARCHAR2(15) NOT NULL,
    model        VARCHAR2(20) NOT NULL
);

ALTER TABLE device ADD CONSTRAINT device_pk PRIMARY KEY ( id );

ALTER TABLE device ADD CONSTRAINT device_serialnumber_un UNIQUE ( serialnumber );

CREATE TABLE electricitycompany (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(40) NOT NULL
);

ALTER TABLE electricitycompany ADD CONSTRAINT electricitycompany_pk PRIMARY KEY ( id );

CREATE TABLE region (
    id        NUMBER(20) NOT NULL,
    name      VARCHAR2(70) NOT NULL,
    idcountry NUMBER(20) NOT NULL
);

ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id );

CREATE TABLE result (
    id           NUMBER(20) NOT NULL,
    kwh          NUMBER(10, 3),
    "date"       DATE,
    power        NUMBER(10, 3),
    ampere       NUMBER(10, 3),
    iduserdevice NUMBER(20) NOT NULL
);

ALTER TABLE result ADD CONSTRAINT result_pk PRIMARY KEY ( id );

CREATE TABLE userdevice (
    id            NUMBER(20) NOT NULL,
    alias         VARCHAR2(20),
    status        CHAR(1) NOT NULL,
    creationdate  DATE NOT NULL,
    lastconection DATE NOT NULL,
    description   VARCHAR2(30),
    iduser        NUMBER(20) NOT NULL,
    iddevice      NUMBER(20) NOT NULL
);

ALTER TABLE userdevice ADD CONSTRAINT userdevice_pk PRIMARY KEY ( id );

ALTER TABLE address
    ADD CONSTRAINT address_comuna_fk FOREIGN KEY ( idcomuna )
        REFERENCES comuna ( id );

ALTER TABLE appuser
    ADD CONSTRAINT appuser_address_fk FOREIGN KEY ( idaddress )
        REFERENCES address ( id );

ALTER TABLE appuser
    ADD CONSTRAINT appuser_contract_fk FOREIGN KEY ( idcontract )
        REFERENCES contract ( id );

ALTER TABLE comuna
    ADD CONSTRAINT comuna_region_fk FOREIGN KEY ( idregion )
        REFERENCES region ( id );

ALTER TABLE contract
    ADD CONSTRAINT contract_electricitycompany_fk FOREIGN KEY ( idelectricitycompany )
        REFERENCES electricitycompany ( id );

ALTER TABLE region
    ADD CONSTRAINT region_country_fk FOREIGN KEY ( idcountry )
        REFERENCES country ( id );

ALTER TABLE result
    ADD CONSTRAINT result_userdevice_fk FOREIGN KEY ( iduserdevice )
        REFERENCES userdevice ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT userdevice_appuser_fk FOREIGN KEY ( iduser )
        REFERENCES appuser ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT userdevice_device_fk FOREIGN KEY ( iddevice )
        REFERENCES device ( id );

CREATE SEQUENCE address_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER address_id_trg BEFORE
    INSERT ON address
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := address_id_seq.nextval;
END;
/

CREATE SEQUENCE appuser_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER appuser_id_trg BEFORE
    INSERT ON appuser
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := appuser_id_seq.nextval;
END;
/

CREATE SEQUENCE comuna_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER comuna_id_trg BEFORE
    INSERT ON comuna
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := comuna_id_seq.nextval;
END;
/

CREATE SEQUENCE contract_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER contract_id_trg BEFORE
    INSERT ON contract
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := contract_id_seq.nextval;
END;
/

CREATE SEQUENCE country_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER country_id_trg BEFORE
    INSERT ON country
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := country_id_seq.nextval;
END;
/

CREATE SEQUENCE device_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER device_id_trg BEFORE
    INSERT ON device
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := device_id_seq.nextval;
END;
/

CREATE SEQUENCE electricitycompany_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER electricitycompany_id_trg BEFORE
    INSERT ON electricitycompany
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := electricitycompany_id_seq.nextval;
END;
/

CREATE SEQUENCE region_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER region_id_trg BEFORE
    INSERT ON region
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := region_id_seq.nextval;
END;
/

CREATE SEQUENCE result_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER result_id_trg BEFORE
    INSERT ON result
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := result_id_seq.nextval;
END;
/

CREATE SEQUENCE userdevice_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER userdevice_id_trg BEFORE
    INSERT ON userdevice
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := userdevice_id_seq.nextval;
END;
/



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                            10
-- CREATE INDEX                             0
-- ALTER TABLE                             20
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                          10
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                         10
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
