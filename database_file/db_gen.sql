drop schema if exists parallel_db;
create schema parallel_db;
use parallel_db;
create table user_(
  username varchar(10) primary key
);

create table group_(
  groupname varchar(10) primary key
);

create table join_(
  username varchar(10),
  groupname varchar(10),
  last_read int(6),
  constraint PK primary key (username, groupname),
  constraint FK_join1 foreign key (username)  references user_(username),
  constraint FK_join2 foreign key (groupname) references group_(groupname)
);
create table message(
  msg_ID int(6) primary key auto_increment,
  content varchar(200),
  time_stamp timestamp,
  username varchar(10),
  groupname varchar(10),
  constraint FK_msg1 foreign key (username)  references user_(username),
  constraint FK_msg2 foreign key (groupname) references group_(groupname)
);