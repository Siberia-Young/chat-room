-- 创建用户表
CREATE TABLE IF NOT EXISTS Users (
  userId CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL DEFAULT 'NoNickname',
  password VARCHAR(255) NOT NULL,
  avatarUrl TEXT,
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建聊天表
CREATE TABLE IF NOT EXISTS Chats (
  chatId CHAR(36) PRIMARY KEY,
  chatName VARCHAR(255),
  lastUpdated TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建消息表
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

-- 创建参与者表，用于多对多关系
CREATE TABLE IF NOT EXISTS Participants (
  chatId CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chatId, userId),
  FOREIGN KEY (chatId) REFERENCES Chats(chatId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- 为提高查询效率创建索引
CREATE INDEX idx_messages_chat ON Messages(chatId);
CREATE INDEX idx_participants_user ON Participants(userId);