## 客户端

### 一、主色

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191117130059381.png)

#### 1.主色

#409eff

#### 2.渐变色

#53a8ff

#66b1ff

#79bbff

#8cc5ff

#a0cfff

#b3d8ff

#c6e2ff

#d9ecff

### 二、辅助色

#### 1.Success

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191117130303884.png)

#67c23a

#e1f3d8

#f0f9eb

#### 2.Info

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019111713034428.png)

#909399

#e9e9eb

#f4f4f5

#### 3.Warning

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191117130432387.png)

#e6a23c

#faecd8

#fdf6ec

#### 4.Danger

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019111713051750.png)

#f56c6c

#fde2e2

#fef0f0

### 三、中性色

#### 1.文字

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191117130701112.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMyNjE3NzAz,size_16,color_FFFFFF,t_70)

#303133

#606266

#909399

#c0c4cc

#### 2.边框

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191117130746485.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMyNjE3NzAz,size_16,color_FFFFFF,t_70)

#dcdfe6

#e4e7ed

#ebeef5

#f2f6fc

# 数据库设计

### 1、用户表（Users）

```mysql
CREATE TABLE IF NOT EXISTS Users (
  userId CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL DEFAULT 'NoNickname',
  password VARCHAR(255) NOT NULL,
  avatarUrl TEXT,
  signature TEXT,
  status ENUM('online', 'offline', 'banned') DEFAULT 'online',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```mysql
INSERT INTO Users (userId, username, password, avatarUrl, status) VALUES ('123456', '123456', 'aaa', 'http://47.113.109.49/source/h2.png', 'online');
INSERT INTO Users (userId, username, password, avatarUrl, status) VALUES ('654321', '654321', 'bbb', 'http://47.113.109.49/source/h3.png', 'online');
```

### 2. 聊天表（Chats）

```mysql
CREATE TABLE IF NOT EXISTS Chats (
  chatId CHAR(36) NOT NULL PRIMARY KEY,
  type ENUM('single', 'double', 'group') DEFAULT 'double',
  name VARCHAR(255),
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```mysql
INSERT INTO Chats (chatId, lastUpdated) VALUES ('1', NOW());
```

### 3. 参与者表（Participants）

```mysql
CREATE TABLE IF NOT EXISTS Participants (
  chatId CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chatId, userId),
  FOREIGN KEY (chatId) REFERENCES Chats(chatId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);
```

```mysql
INSERT INTO Participants (chatId, userId) VALUES ('1', '123456');
INSERT INTO Participants (chatId, userId) VALUES ('1', '654321');
```

### 4. 消息表（Messages）

```mysql
CREATE TABLE IF NOT EXISTS Messages (
  messageId CHAR(36) NOT NULL PRIMARY KEY,
  chatId CHAR(36) NOT NULL,
  fromUserId CHAR(36) NOT NULL,
  toUserId CHAR(36),
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type ENUM('text', 'image', 'video', 'file') DEFAULT 'text',
  status ENUM('pending', 'delivered', 'read', 'failed') DEFAULT 'pending',
  readReceipt BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatId) REFERENCES Chats(chatId),
  FOREIGN KEY (fromUserId) REFERENCES Users(userId),
  FOREIGN KEY (toUserId) REFERENCES Users(userId)
);
```

```mysql
INSERT INTO Messages (messageId, chatId, fromUserId, toUserId, content, timestamp, type, status, readReceipt) 
VALUES ('1', '1', '123456', '654321', 'How\'s your day going?', NOW(), 'text', 'delivered', FALSE);
INSERT INTO Messages (messageId, chatId, fromUserId, toUserId, content, timestamp, type, status, readReceipt) 
VALUES ('2', '1', '654321', '123456', 'It\'s going great, thanks! How about you?', NOW() + INTERVAL 5 MINUTE, 'text', 'read', TRUE);
INSERT INTO Messages (messageId, chatId, fromUserId, toUserId, content, timestamp, type, status, readReceipt) 
VALUES ('3', '1', '123456', '654321', 'I\'m doing well too. Thanks for asking!', NOW() + INTERVAL 10 MINUTE, 'text', 'delivered', FALSE);
INSERT INTO Messages (messageId, chatId, fromUserId, toUserId, content, timestamp, type, status, readReceipt) 
VALUES ('4', '1', '654321', '123456', 'Here is a picture from my trip.', NOW() + INTERVAL 15 MINUTE, 'text', 'delivered', FALSE);
INSERT INTO Messages (messageId, chatId, fromUserId, toUserId, content, timestamp, type, status, readReceipt) 
VALUES ('5', '1', '123456', '654321', 'Check out this funny video!', NOW() + INTERVAL 20 MINUTE, 'text', 'delivered', FALSE);
```

### 5.好友关系表（Friends）

```mysql
CREATE TABLE Friends (
    userId1 CHAR(36) NOT NULL,
    userId2 CHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'blocked') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (userId1, userId2),
    FOREIGN KEY (userId1) REFERENCES Users(userId),
    FOREIGN KEY (userId2) REFERENCES Users(userId)
);
```

```mysql
INSERT INTO Friends (userId1, userId2, status) VALUES ('123456', '654321', 'accepted');
```

### 6.好友申请表（FriendRequests）

```mysql
CREATE TABLE FriendRequests (
    requestId CHAR(36) NOT NULL PRIMARY KEY,
    fromUserId CHAR(36) NOT NULL,
    toUserId CHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    message TEXT,
    FOREIGN KEY (fromUserId) REFERENCES Users(userId),
    FOREIGN KEY (toUserId) REFERENCES Users(userId)
);
```

```mysql
INSERT INTO FriendRequests (requestId, fromUserId, toUserId, status, message)
VALUES ('1', '123456', '888888', 'pending', 'Hi, I\'d like to add you as a friend!');
```



### #提高查询效率

```mysql
CREATE INDEX idx_messages_chat ON Messages(chatId);
CREATE INDEX idx_participants_user ON Participants(userId);
```





阅读下面四个表格：

用户表：

CREATE TABLE IF NOT EXISTS Users (
  userId CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL DEFAULT 'NoNickname',
  password VARCHAR(255) NOT NULL,
  avatarUrl TEXT,
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

聊天表：

CREATE TABLE IF NOT EXISTS Chats (
  chatId CHAR(36) PRIMARY KEY,
  lastUpdated TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

参与者表：

CREATE TABLE IF NOT EXISTS Participants (
  chatId CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chatId, userId),
  FOREIGN KEY (chatId) REFERENCES Chats(chatId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

消息表：

CREATE TABLE IF NOT EXISTS Messages (
  messageId CHAR(36) PRIMARY KEY,
  chatId CHAR(36) NOT NULL,
  fromUserId CHAR(36) NOT NULL,
  toUserId CHAR(36),
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type ENUM('text', 'image', 'video', 'file') DEFAULT 'text',
  status ENUM('pending', 'delivered', 'read', 'failed') DEFAULT 'pending',
  readReceipt BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatId) REFERENCES Chats(chatId),
  FOREIGN KEY (fromUserId) REFERENCES Users(userId),
  FOREIGN KEY (toUserId) REFERENCES Users(userId)
);

请依据userId，找出所有该userId参与的聊天记录列表，并将聊天记录按照lastUpdated倒序返回，每条聊天记录还包含该聊天的最新一条消息以及发最新一条消息的用户信息