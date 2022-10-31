create table newsletter_subscribers
(
    id    int auto_increment
        primary key,
    path  varchar(255) null,
    email varchar(255) null
);