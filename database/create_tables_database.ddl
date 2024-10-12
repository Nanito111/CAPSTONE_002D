-- Generado por Oracle SQL Developer Data Modeler 21.2.0.183.1957
--   en:        2024-10-12 19:15:33 CLST
--   sitio:      Oracle Database 21c
--   tipo:      Oracle Database 21c



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE address (
    id           NUMBER(20) NOT NULL,
    streetname   VARCHAR2(100) NOT NULL,
    streetnumber NUMBER(20) NOT NULL,
    description  VARCHAR2(70) NOT NULL,
    idcomuna     NUMBER(20) NOT NULL,
    idcountry    NUMBER(20) NOT NULL,
    idregion     NUMBER(20) NOT NULL
);

ALTER TABLE address ADD CONSTRAINT address_pk PRIMARY KEY ( id );

CREATE TABLE chargetype (
    id   NUMBER(2) NOT NULL,
    name VARCHAR2(10) NOT NULL
);

ALTER TABLE chargetype ADD CONSTRAINT chargetype_pk PRIMARY KEY ( id );

CREATE TABLE comuna (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(20) NOT NULL
);

ALTER TABLE comuna ADD CONSTRAINT comuna_pk PRIMARY KEY ( id );

CREATE TABLE contract (
    id                   NUMBER(20) NOT NULL,
    fixedcost            NUMBER(20) NOT NULL,
    variablecost         NUMBER(20) NOT NULL,
    kwhvariable          NUMBER(20, 2) NOT NULL,
    idelectricitycompany NUMBER(20) NOT NULL,
    idchargetype         NUMBER(2) NOT NULL
);

ALTER TABLE contract ADD CONSTRAINT contract_pk PRIMARY KEY ( id );

CREATE TABLE country (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(20) NOT NULL
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
    name VARCHAR2(20) NOT NULL
);

ALTER TABLE electricitycompany ADD CONSTRAINT electricitycompany_pk PRIMARY KEY ( id );

CREATE TABLE region (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(20) NOT NULL
);

ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id );

CREATE TABLE result (
    id           NUMBER(20) NOT NULL,
    kwh          NUMBER(15),
    "date"       DATE,
    potential    NUMBER(9),
    ampere       NUMBER(9),
    iduserdevice NUMBER(20) NOT NULL
);

ALTER TABLE result ADD CONSTRAINT result_pk PRIMARY KEY ( id );

CREATE TABLE "User" (
    id             NUMBER(20) NOT NULL,
    firstname      VARCHAR2(20),
    middlename     VARCHAR2(20),
    lastname       VARCHAR2(12),
    secondlastname VARCHAR2(12),
    countrycode    VARCHAR2(3),
    numberphone    NUMBER(9),
    email          VARCHAR2(500) NOT NULL,
    password       RAW(255) NOT NULL,
    idaddress      NUMBER(20) NOT NULL,
    idcontract     NUMBER(20) NOT NULL
);

ALTER TABLE "User" ADD CONSTRAINT user_pk PRIMARY KEY ( id );

CREATE TABLE userdevice (
    id            NUMBER(20) NOT NULL,
    alias         VARCHAR2(20),
    status        NUMBER NOT NULL,
    creationdate  DATE NOT NULL,
    lastconection DATE NOT NULL,
    description   VARCHAR2(30),
    user_iduser   NUMBER(20) NOT NULL,
    iddevice      NUMBER(20) NOT NULL
);

ALTER TABLE userdevice ADD CONSTRAINT userdevice_pk PRIMARY KEY ( id );

ALTER TABLE address
    ADD CONSTRAINT address_comuna_fk FOREIGN KEY ( idcomuna )
        REFERENCES comuna ( id );

ALTER TABLE address
    ADD CONSTRAINT address_country_fk FOREIGN KEY ( idcountry )
        REFERENCES country ( id );

ALTER TABLE address
    ADD CONSTRAINT address_region_fk FOREIGN KEY ( idregion )
        REFERENCES region ( id );

ALTER TABLE contract
    ADD CONSTRAINT contract_chargetype_fk FOREIGN KEY ( idchargetype )
        REFERENCES chargetype ( id );

ALTER TABLE contract
    ADD CONSTRAINT contract_electricitycompany_fk FOREIGN KEY ( idelectricitycompany )
        REFERENCES electricitycompany ( id );

ALTER TABLE result
    ADD CONSTRAINT result_userdevice_fk FOREIGN KEY ( iduserdevice )
        REFERENCES userdevice ( id );

ALTER TABLE "User"
    ADD CONSTRAINT user_address_fk FOREIGN KEY ( idaddress )
        REFERENCES address ( id );

ALTER TABLE "User"
    ADD CONSTRAINT user_contract_fk FOREIGN KEY ( idcontract )
        REFERENCES contract ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT userdevice_device_fk FOREIGN KEY ( iddevice )
        REFERENCES device ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT userdevice_user_fk FOREIGN KEY ( user_iduser )
        REFERENCES "User" ( id );



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                            11
-- CREATE INDEX                             0
-- ALTER TABLE                             22
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
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
-- CREATE SEQUENCE                          0
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
