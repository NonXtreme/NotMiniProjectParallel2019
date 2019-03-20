drop schema if exists parallel_db;
create schema parallel_db;
use parallel_db;
create table user_(
  user_ID int primary key auto_increment,
  username varchar(10),
  passwd varchar(20)
);

create table group_(
  group_ID int primary key auto_increment,
  groupname varchar(10)
);

create table join_(
  user_ID int,
  group_ID int,
  constraint PK primary key (user_ID, group_ID),
  constraint FK_join1 foreign key (user_ID)  references user_(user_ID),
  constraint FK_join2 foreign key (group_ID) references group_(group_ID)
);
create table message(
  msg_ID int(6) primary key auto_increment,
  content varchar(200),
  time_stamp timestamp,
  user_ID int,
  group_ID int,
  constraint FK_msg1 foreign key (user_ID)  references user_(user_ID),
  constraint FK_msg2 foreign key (group_ID) references group_(group_ID)
);