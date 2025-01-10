WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Testing New Sauerkraut Variations', 'I’ve been experimenting with different ways to make sauerkraut, and I think I’ve got a few new variations that could be great! One version is with added caraway seeds for a little extra flavor, and another one has a touch of apple for sweetness. It’s all about getting that perfect balance between sour and savory. I’ll let you know how it turns out after a few days of fermentation. Can’t wait to try it out!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567909', '+491234567910', '+491234567911']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Meme Coin Portfolio Update', 'So I’ve been holding a few meme coins for a while, and let me tell you, it’s been a rollercoaster! Dogecoin, Shiba Inu, and now even Floki Inu—each of them had its moments, but honestly, it’s hard to keep up with the market sometimes. I’m thinking of diversifying a little more and maybe adding a few more coins to the mix. I’ll let you know if I find anything new, but I’m always on the lookout for the next big thing in crypto!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567912', '+491234567913', '+491234567914']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Planning a German Feast This Weekend', 'I’m thinking of putting together a full German meal this weekend – a real feast! I’m planning to make schnitzels, red cabbage, and some hearty potato salad. I might even bake some pretzels if I have the time! The only problem is I’ll need a lot of help with the prep, so anyone up for a cooking party? It’s going to be a lot of work, but totally worth it for a traditional meal like this. Let me know if you’re in!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567915', '+491234567916', '+491234567917']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Shiba Inu Coin – To Hold or Sell?', 'I’ve been watching Shiba Inu closely over the past few weeks, and the price has been fluctuating a lot. Part of me wants to sell and take whatever profit I can get, but another part of me thinks this coin has more room to grow. There’s a lot of talk about Shiba’s potential, but I don’t know if it’s just hype. What do you think? Should I hold or just cash out now before it drops further? I’m still on the fence!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567918', '+491234567919', '+491234567920']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Trying New Bavarian Recipes', 'I’ve been diving into some classic Bavarian recipes lately, and it’s been so much fun! I’m planning to make some beef rouladen next – thin beef wrapped with mustard, pickles, and bacon, then slow-cooked until tender. It’s one of my favorite dishes from Germany. I can’t wait to see how it turns out. I’ll be testing it out with some homemade spaetzle and gravy. It’s going to be a full-on Bavarian dinner!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567921', '+491234567922', '+491234567923']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Meme Coin Madness: Which One Next?', 'I’ve been following the whole meme coin craze, and it’s been a wild ride. Dogecoin and Shiba Inu were just the beginning, but now there are a ton of new coins to choose from. Floki Inu, Kishu Inu, and SafeMoon, to name a few. I’m wondering which one is next to explode. The market is unpredictable, but I can’t resist the excitement of the meme coin space. What do you think, is there a hidden gem I should check out?', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567924', '+491234567925', '+491234567926']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Bavarian Meatballs on the Menu!', 'I’m planning on making some traditional Bavarian meatballs this weekend, and I think they’ll be a hit. These meatballs are super tender and packed with flavor, thanks to the mixture of pork, beef, and a little bit of marjoram. I’m serving them with a side of gravy and mashed potatoes, of course. It’s the ultimate comfort food! Can’t wait to dig in and share them with the family this weekend!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567927', '+491234567928', '+491234567929']::text[]) as phone
FROM insert_message;
