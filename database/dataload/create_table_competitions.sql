-- auto-generated definition
create table competitions
(
    id              int(10) auto_increment
        primary key,
    competitionpath varchar(255) null,
    firstname       varchar(255) null,
    lastname        varchar(255) null,
    email           varchar(255) null,
    position        varchar(255) null,
    contact         varchar(255) null,
    sector          varchar(255) null,
    size            varchar(255) null,
    answer          varchar(255) null,
    answer2         varchar(255) null,
    answer3         varchar(255) null,
    answer4         varchar(255) null,
    answer5         varchar(255) null
);