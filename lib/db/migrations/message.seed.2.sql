WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Delicious Sauerbraten Recipe', 'I just made some sauerbraten and it was absolutely delicious! The slow-cooked beef with a mix of spices like vinegar, sugar, and onions made the flavor amazing. This dish is perfect for cold winter evenings, served with dumplings or red cabbage. I can’t believe I waited so long to try it! If you’re looking for a hearty, traditional German dish to make at home, this one is a must-try. You’ll love it, trust me!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567890', '+491234567891', '+491234567892']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'DogeCoin to the Moon!', 'I just bought more DogeCoin! It’s crazy how much hype there is around this coin right now. People are calling it the next big thing in the crypto world, and the community is growing fast. If you haven’t already jumped in, now’s the time. Don’t miss the train! I really believe in DogeCoin’s potential for huge gains in the future. Let’s hold tight and see where this journey takes us! Doge to the moon, baby!', 'SCHEDULED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567893', '+491234567894', '+491234567895']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Pretzel Recipe Gone Wrong', 'I tried baking homemade pretzels yesterday, and they turned out way too hard! It was a disaster. I followed the recipe to a T, but something went wrong. Maybe I overcooked them or didn’t let the dough rise long enough, I’m not sure. Either way, I’m definitely going to give it another shot. Anyone have a good recipe for soft, chewy pretzels? I could use some tips before I try again!', 'FAILED', 'TRASH', 'Baking instructions unclear') 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567896', '+491234567897']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Shiba Inu Coin – Next Big Thing!', 'Shiba Inu coin is blowing up right now! It’s been making waves in the crypto world, and it’s starting to look like it could be the next big thing. I’m all in, and I really believe it could give Bitcoin a run for its money in the future. If you haven’t heard about it yet, you might want to start paying attention. Let’s get in before it explodes even more. Who’s ready for the Shiba Inu revolution?', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567898', '+491234567899', '+491234567900']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Schnitzel Recipe Idea', 'I’m thinking of trying out a schnitzel recipe with a twist this weekend. Instead of the classic breadcrumbs, I want to experiment with panko and add some parmesan cheese to give it a cheesy crunch. Also, I’m going to serve it with a homemade lemon butter sauce for an extra layer of flavor. Anyone tried something like this before? I’m hoping it turns out as delicious as I’m imagining!', 'DRAFTED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567901', '+491234567902', '+491234567903']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Floki Inu – What Happened?!', 'I tried to get into Floki Inu earlier this year, but things aren’t looking great right now. My investment is sinking fast, and it’s been really frustrating to watch the market crash. I was hoping the hype would drive up the price, but it seems like I was wrong. Should I cut my losses now, or hold on a bit longer? Let me know if you’ve had better luck with Floki or other meme coins!', 'FAILED', 'TRASH', 'Market crash') 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567904', '+491234567905']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Bavarian Potato Salad', 'I tried making authentic Bavarian potato salad last weekend, and it turned out amazing! The creamy dressing made with mustard, vinegar, and a touch of sugar is the secret. I also added some crispy bacon bits for extra flavor. It’s the perfect side dish for any hearty meal, especially grilled meats or sausages. You really can’t go wrong with this one. It’s become one of my favorite recipes to make for family gatherings!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567906', '+491234567907', '+491234567908']::text[]) as phone
FROM insert_message;
WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Trying Out Some Homemade Sauerkraut!', 'I’ve always loved sauerkraut, but I never tried making it myself until now! It’s actually surprisingly easy to make – just cabbage, salt, and time. You let it ferment for a few days, and boom, you have this tangy, crunchy goodness. I paired it with some bratwurst and mashed potatoes, and it was a perfect combo. You should give it a try if you like traditional German flavors!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567890', '+491234567891', '+491234567892']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Meme Coins Are the New Gold Rush!', 'You guys have to check out the latest meme coins. Dogecoin started it all, but now there’s like a million different ones popping up, and some of them are doing surprisingly well! I put some money into Shiba Inu, and it’s been wild. I’m not saying you should rush into it, but if you’re looking to make a quick buck, these coins are the way to go. Just be careful and don’t bet everything on them!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567893', '+491234567894', '+491234567895']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Making The Best German Meatballs!', 'I’ve been working on perfecting my recipe for German-style meatballs, and I think I’ve finally nailed it! The key is to add a little bit of mustard to the mix, which gives them a nice tangy flavor. I also use a combination of pork and beef for the best texture. They’re so juicy and tender, you won’t believe it. Serve them with mashed potatoes and a rich gravy, and you’ve got a meal that’s hard to beat!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567896', '+491234567897']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Floki Inu – To the Moon or to the Abyss?', 'I bought some Floki Inu recently because, you know, meme coin hype and all that. But honestly, I’m starting to regret it. The price has been all over the place, and I’m not sure it’s going to recover. It’s tough to say if I should hold onto it or sell out now before I lose more. Anyone else in the same boat with Floki or other meme coins? Let’s share tips!', 'FAILED', 'TRASH', 'Price drop') 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567898', '+491234567899', '+491234567900']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Schnitzel with a Twist!', 'I’m planning to make schnitzel this weekend, but I want to try something different. I’m thinking of using sweet potato fries as a side instead of the usual potatoes. I love how crispy and sweet they get in the oven! Also, I’m going to try a new schnitzel coating with panko and Parmesan. It sounds like a game-changer! What do you think, should I go for it or stick with the classic recipe?', 'SCHEDULED', 'DRAFT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567901', '+491234567902', '+491234567903']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'DogeCoin Still Going Strong!', 'Is anyone still holding DogeCoin? I know it started as a joke, but it’s doing way better than I expected. The community around Doge is so strong, and it’s got serious potential for growth. I’ve been holding mine for a while, and I’ve made some decent profits. If you’re thinking about getting in, now might be a good time, especially if you can get it at a good price. Let’s ride this wave together!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567904', '+491234567905']::text[]) as phone
FROM insert_message;

WITH insert_message AS (
  INSERT INTO message (user_id, subject, body, status, location, failure_reason) 
  VALUES (1, 'Bavarian Pretzels at Home!', 'I tried making homemade Bavarian pretzels for the first time yesterday, and they actually turned out pretty good! The dough was soft and chewy, just like the ones you get in beer gardens in Germany. I made sure to follow the instructions carefully, and it worked out perfectly. The best part is the crispy, salty crust on top. If you’re looking for a fun project to do, I definitely recommend giving pretzels a go!', 'SENT', 'SENT', NULL) 
  RETURNING id
)
INSERT INTO recipient (message_id, phone)
SELECT 
  insert_message.id, 
  unnest(ARRAY['+491234567906', '+491234567907', '+491234567908']::text[]) as phone
FROM insert_message;