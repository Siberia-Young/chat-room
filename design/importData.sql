INSERT INTO Users (userId, username, password, avatarUrl, status) VALUES ('123456', '123456', 'aaa', 'https://img1.baidu.com/it/u=1960110688,1786190632&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281', 'online');
INSERT INTO Users (userId, username, password, avatarUrl, status) VALUES ('654321', '654321', 'bbb', 'https://img2.baidu.com/it/u=2048195462,703560066&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333', 'online');

INSERT INTO Chats (chatId, lastUpdated) VALUES ('1', NOW());

INSERT INTO Participants (chatId, userId) VALUES ('1', '123456');
INSERT INTO Participants (chatId, userId) VALUES ('1', '654321');

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