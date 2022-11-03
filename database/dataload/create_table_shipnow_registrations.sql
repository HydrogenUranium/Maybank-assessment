-- auto-generated definition
create table shipnow_registrations
(
    id                   int(10) auto_increment
        primary key,
    firstname            varchar(255)                            null,
    lastname             varchar(255)                            null,
    email                varchar(255)                            null,
    position             varchar(255)                            null,
    contact              varchar(255)                            null,
    datecreated          timestamp default CURRENT_TIMESTAMP not null,
    path                 varchar(255)                            null,
    company              varchar(255)                            null,
    phone                varchar(255)                            null,
    address              varchar(255)                            null,
    city                 varchar(255)                            null,
    country              varchar(255)                            null,
    countrycode          varchar(255)                            null,
    currency             varchar(255)                            null,
    source               varchar(255)                            null,
    lo                   varchar(255)                            null,
    synced               tinyint                                 null,
    postcode             varchar(255)                            null
);

