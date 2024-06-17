# 前端接口调用返回

### 一、用户（User）

```javascript
{
  "userId": "string",
  "username": "string",
  "avatarUrl": "string", // 用户头像的URL
  "status": "string" // 用户状态，如在线、离线、忙碌等
}
```

### 二、消息（Message）

```javascript
{
  "messageId": "string",
  "fromUser": "User", // 发送者用户信息，参考上面的User结构
  "toUser": "User", // 接收者用户信息
  "content": "string", // 消息内容
  "timestamp": "string", // 消息发送的时间戳，格式如ISO 8601
  "type": "string", // 消息类型，如文本、图片、视频等
  "status": "string", // 消息状态，如已发送、已接收、已读等
  "readReceipt": "boolean" // 是否已读回执
}
```

### 三、聊天记录（ChatRecord）

```javascript
{
  "chatId": "string",
  "participants": [ // 参与聊天的用户列表
    "User",
    "User"
    // ...
  ],
  "messages": [ // 聊天中的消息列表
    "Message",
    "Message"
    // ...
  ],
  "lastUpdated": "string" // 聊天最后更新的时间戳
}
```

### 四、聊天记录集合（ChatRecordList）

```javascript
{
  "user": "User", // 当前查看聊天记录的用户信息
  "list": [ // 用户参与的所有聊天记录
    "ChatRecord",
    "ChatRecord"
    // ...
  ]
}
```

### #示例

```javascript
{
  "user": {
    "userId": "123456",
    "username": "JohnDoe",
    "avatarUrl": "http://example.com/avatar.jpg",
    "status": "online"
  },
  "chats": [
    {
      "chatId": "chat_001",
      "participants": [
        {
          "userId": "123456",
          "username": "JohnDoe"
        },
        {
          "userId": "654321",
          "username": "JaneDoe"
        }
      ],
      "messages": [
        {
          "messageId": "msg_001",
          "fromUser": {
            "userId": "123456",
            "username": "JohnDoe"
          },
          "toUser": {
            "userId": "654321",
            "username": "JaneDoe"
          },
          "content": "Hello, Jane!",
          "timestamp": "2024-06-07T12:00:00Z",
          "type": "text",
          "status": "delivered",
          "readReceipt": false
        },
        {
          "messageId": "msg_002",
          "fromUser": {
            "userId": "654321",
            "username": "JaneDoe"
          },
          "toUser": {
            "userId": "123456",
            "username": "JohnDoe"
          },
          "content": "Hi, John! How are you?",
          "timestamp": "2024-06-07T12:05:00Z",
          "type": "text",
          "status": "read",
          "readReceipt": true
        }
      ],
      "lastUpdated": "2024-06-07T12:05:00Z"
    }
  ]
}
```

# 数据库设计

### 1、用户表（Users）

```mysql
CREATE TABLE IF NOT EXISTS Users (
  userId CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL DEFAULT 'NoNickname',
  password VARCHAR(255) NOT NULL,
  avatarUrl TEXT,
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
  chatId CHAR(36) PRIMARY KEY,
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