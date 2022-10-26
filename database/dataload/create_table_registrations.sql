-- auto-generated definition
create table registrations
(
    id                   int(10) auto_increment
        primary key,
    firstname            varchar(255) not null,
    lastname             varchar(255) not null,
    email                varchar(255) not null,
    position             varchar(255) not null,
    contact              varchar(255) not null,
    sector               varchar(255) not null,
    size                 varchar(255) not null,
    interest_categories  varchar(255) not null,
    islinkedin           tinyint      not null,
    tcagree              tinyint      not null,
    full                 tinyint      not null,
    username             varchar(255) not null,
    password             varchar(255) not null,
    salt                 varchar(255) not null,
    token                varchar(255) not null,
    refresh_token        varchar(255) not null,
    password_reset_token varchar(255) null,
    ttl                  timestamp    null,
    datecreated          timestamp    null
);

