

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
    id            NUMBER(20) NOT NULL,
    serialnumber  VARCHAR2(20) NOT NULL,
    iddevicemodel NUMBER(20) NOT NULL
);

ALTER TABLE device ADD CONSTRAINT device_pk PRIMARY KEY ( id );

ALTER TABLE device ADD CONSTRAINT serialnumber_un UNIQUE ( serialnumber );

CREATE TABLE devicemodel (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(30) NOT NULL
);

ALTER TABLE devicemodel ADD CONSTRAINT devicemodel_pk PRIMARY KEY ( id );

CREATE TABLE electricitycompany (
    id   NUMBER(20) NOT NULL,
    name VARCHAR2(40) NOT NULL
);

ALTER TABLE electricitycompany ADD CONSTRAINT electricitycompany_pk PRIMARY KEY ( id );

CREATE TABLE passrecoverrequest (
    id             NUMBER(20) NOT NULL,
    request        RAW(255) NOT NULL,
    email          VARCHAR2(500) NOT NULL,
    expiredatetime TIMESTAMP NOT NULL
);

ALTER TABLE passrecoverrequest ADD CONSTRAINT passrecoverrequest_pk PRIMARY KEY ( id );

ALTER TABLE passrecoverrequest ADD CONSTRAINT request_un UNIQUE ( request );

CREATE TABLE region (
    id        NUMBER(20) NOT NULL,
    name      VARCHAR2(70) NOT NULL,
    idcountry NUMBER(20) NOT NULL
);

ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id );

CREATE TABLE result (
    id           NUMBER(20) NOT NULL,
    kws          NUMBER(10, 3),
    measuretime  TIMESTAMP,
    iduserdevice NUMBER(20) NOT NULL
);

ALTER TABLE result ADD CONSTRAINT result_pk PRIMARY KEY ( id );

CREATE TABLE userdevice (
    id             NUMBER(20) NOT NULL,
    alias          VARCHAR2(15),
    creationdate   TIMESTAMP NOT NULL,
    lastconnection TIMESTAMP NOT NULL,
    description    VARCHAR2(50),
    iduser         NUMBER(20) NOT NULL,
    iddevice       NUMBER(20) NOT NULL
);

ALTER TABLE userdevice ADD CONSTRAINT userdevice_pk PRIMARY KEY ( id );

ALTER TABLE appuser
    ADD CONSTRAINT address_fk FOREIGN KEY ( idaddress )
        REFERENCES address ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT appuser_fk FOREIGN KEY ( iduser )
        REFERENCES appuser ( id );

ALTER TABLE address
    ADD CONSTRAINT comuna_fk FOREIGN KEY ( idcomuna )
        REFERENCES comuna ( id );

ALTER TABLE appuser
    ADD CONSTRAINT contract_fk FOREIGN KEY ( idcontract )
        REFERENCES contract ( id );

ALTER TABLE region
    ADD CONSTRAINT country_fk FOREIGN KEY ( idcountry )
        REFERENCES country ( id );

ALTER TABLE userdevice
    ADD CONSTRAINT device_fk FOREIGN KEY ( iddevice )
        REFERENCES device ( id );

ALTER TABLE device
    ADD CONSTRAINT devicemodel_fk FOREIGN KEY ( iddevicemodel )
        REFERENCES devicemodel ( id );

ALTER TABLE contract
    ADD CONSTRAINT electricitycompany_fk FOREIGN KEY ( idelectricitycompany )
        REFERENCES electricitycompany ( id );

ALTER TABLE comuna
    ADD CONSTRAINT region_fk FOREIGN KEY ( idregion )
        REFERENCES region ( id );

ALTER TABLE result
    ADD CONSTRAINT userdevice_fk FOREIGN KEY ( iduserdevice )
        REFERENCES userdevice ( id );

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

CREATE SEQUENCE devicemodel_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER devicemodel_id_trg BEFORE
    INSERT ON devicemodel
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := devicemodel_id_seq.nextval;
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

CREATE SEQUENCE passrecoverrequest_id_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER passrecoverrequest_id_trg BEFORE
    INSERT ON passrecoverrequest
    FOR EACH ROW
    WHEN ( new.id IS NULL )
BEGIN
    :new.id := passrecoverrequest_id_seq.nextval;
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


