WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Dogecoin Pizza Party', 'Just had the best pizza in town, but I can’t stop thinking about Dogecoin. Every time I look at my portfolio, I wonder if one day my meme coins could buy me all the pizza I want. Until then, I’ll just keep hodling and enjoy this slice. Who else is bullish on Dogecoin and pizza?', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-1234', '555-5678', '555-9876']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Meme Coins & Fries', 'Meme coins are a lot like dessert – sweet, fun, but a bit unpredictable. You never really know if you’ll get a sweet payoff or end up with a bad taste. Right now, I’m hoping for a Dogecoin surge while I indulge in some fries. If they both hit, I’ll be in heaven.', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-2345', '555-8765', '555-3456']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Shiba Inu & Burger Thoughts', 'You ever feel like you’re just chasing that next big break with meme coins? Right now, my Shiba Inu is doing well, but I’m not sure if I should sell for a quick profit or hold for the moon. In the meantime, I’m enjoying my burger, trying not to think about it too much.', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-6789', '555-4321', '555-5432']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Shiba Inu Sushi Roll', 'I was enjoying some sushi when I thought, Is Shiba Inu as volatile as this spicy tuna roll? Sometimes it’s a risk, but when it’s good, it’s amazing. I’m still holding onto my Shiba. I’d like to think it’s the sushi of meme coins — unique, tasty, and worth the gamble if you get it at the right time!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-8760', '555-3210', '555-6543']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'SafeMoon Taco Combo', 'I love a good taco, and it’s just like buying into SafeMoon. You don’t always know how many you’re going to get for your money, but when they’re good, they’re really good. The market is like a taco — sometimes it’s spicy, other times it’s mild, but always worth a bite. SafeMoon just needs to hit harder!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-9900', '555-5566', '555-7744']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Dogecoin Burger Bites', 'Just had a huge cheeseburger and checked my Dogecoin holdings. It’s kinda like ordering a burger: sometimes you get the perfect bite, sometimes it’s just okay. But I keep going back for more, just like with Doge. Let’s hope that moon ride is sooner rather than later. Dogecoin to the moon and my burger to my stomach!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-1122', '555-3344', '555-8765']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Shiba Inu Pizza Delivery', 'I’ve been holding Shiba Inu for what feels like an eternity. It’s like waiting for a good pizza delivery: sometimes it’s delayed, sometimes it’s cold, but when it hits, it’s worth it. I just hope Shiba Inu starts delivering like my favorite pizza joint. Ready for that big price surge to finally come in!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-5678', '555-9876', '555-5432']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'SafeMoon Nachos!', 'Just traded some SafeMoon while munching on some nachos. Trading meme coins is like diving into a big plate of nachos — there’s a lot going on, and you never really know what’s coming next. But if you’re careful, you get a lot of flavor in the end. Here’s to hoping SafeMoon tastes like victory soon!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-1111', '555-2345', '555-7777']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Floki Inu Noodle Feast', 'Just had some ramen, and now I’m watching my Floki Inu slowly rise. I can’t help but think that Floki Inu is a bit like ramen — comforting and satisfying when done right, but always a little bit uncertain. If it blows up, I’m going to feel like I’ve hit the jackpot of meme coins!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-1234', '555-5678', '555-8765']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
    INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
    VALUES (1, 'Floki Inu Taco Thoughts', 'Floki Inu is like trying a new restaurant — you don’t know if it’ll be amazing or a complete flop, but there’s this excitement. I’m sitting here enjoying my burger, hoping that Floki’s going to turn into something legendary. Maybe it’ll be the next big thing. Who knows, a burger and Floki Inu could be the next big combo!', 'SENT', 'SENT', NULL) 
    RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
    insert_message.id, 
    unnest(ARRAY['555-9012', '555-4321', '555-6789']::text[]) as phone
FROM insert_message;