use flea;
DROP TABLE IF EXISTS reportData;
DROP TABLE IF EXISTS orderData;
DROP TABLE IF EXISTS shoppingCart;
DROP TABLE IF EXISTS collectionBox;
DROP TABLE IF EXISTS browseTrack;
DROP TABLE IF EXISTS goodInfo;
DROP TABLE IF EXISTS chatRecord;
DROP TABLE IF EXISTS adminAccount;
DROP TABLE IF EXISTS userAccount;

CREATE TABLE IF NOT EXISTS userAccount(
	user_id char(7) primary key,
    mypassword varchar(20) not null,
    real_name varchar(24) not null,
    nickname varchar(24) not null,
    gender varchar(3) not null,
    telnum varchar(15) not null,
    birthday date not null,
    college varchar(25) not null,
    biography varchar(60) not null default '看不懂，很神秘。',
    avatar varchar(20) not null default 'default',
    available numeric(1) not null default 0
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS adminAccount(
	user_id char(7) primary key,
    mypassword varchar(20) not null,
    nickname varchar(24) not null default 'Evan You',
    avatar varchar(20) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists chatRecord(
	a_user_id char(7),
    b_user_id char(7),
    date_time datetime,
    speaker numeric(1),
    details varchar(400) not null,
    primary key(a_user_id, b_user_id, date_time, speaker),
    foreign key(a_user_id) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	foreign key(b_user_id) references userAccount(user_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE    
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists goodInfo(
	good_id int unsigned auto_increment primary key,
    seller_id char(7),
    price numeric(6, 2) not null,
    category varchar(10) not null,
    available numeric(1) not null default 0,
    good_name varchar(30) not null default '元宇宙车票',
    title varchar(60) not null default '车票 但是疯狂的打折',
    keywords varchar(30) not null default '无',
    campus varchar(15) not null default '四平路校区',
    intro varchar(600) not null default '商品介绍',
    detail varchar(200) not null default '交易细节',
    images varchar(200) not null,
    onshelf_time datetime not null default '2022-04-17 16:50:00',
    foreign key(seller_id) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists browseTrack(
    user_id char(7),	
    good_id int unsigned,
    day_time datetime default '2022-04-17 16:50:00',
    primary key(user_id, good_id, day_time),
    foreign key(user_id) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
    foreign key(good_id) references goodInfo(good_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE      
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists collectionBox(
    user_id char(7),	
    good_id int unsigned,
    day_time datetime not null default '2022-04-17 16:50:00',
    primary key(user_id, good_id),
    foreign key(user_id) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
    foreign key(good_id) references goodInfo(good_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE      
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists shoppingCart(
    user_id char(7),	
    good_id int unsigned,
    day_time datetime not null default '2022-04-17 16:50:00',
    primary key(user_id, good_id),
    foreign key(user_id) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
    foreign key(good_id) references goodInfo(good_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE      
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists orderData(
    order_id int unsigned auto_increment primary key,
    buyer char(7),
    seller char(7),
	good_id int unsigned,
    price numeric(6,2) not null,
    generated_time datetime not null default '2022-04-17 16:50:00',
    stat varchar(12) not null default '待付款',
    rate numeric(1) not null,
    review varchar(600),
    review_time datetime,
    foreign key(buyer) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
    foreign key(seller) references userAccount(user_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,        
    foreign key(good_id) references goodInfo(good_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists reportData(
    order_id int unsigned primary key,
    reason varchar(400) not null default '骗钱',
    report_time datetime not null default '2022-04-17 16:50:00',
    stat varchar(9) not null default '待处理',
    reply varchar(300),
    foreign key(order_id) references orderData(order_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;