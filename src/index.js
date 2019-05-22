import {} from "dotenv/config";
import Telegraf from "telegraf";
import searchBooks from "./searchBooks";

const createMessageText = book => {
  return `
<strong>${book.title}</strong>
<em>${book.author}</em>
<a href="${book.thumb_url}">&#8205;</a>`;
};

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on("inline_query", async ctx => {
  const searchResults = await searchBooks(ctx.inlineQuery.query);
  const results =
    searchResults && searchResults.length
      ? searchResults.map((book, id) => ({
          id,
          type: "article",
          title: book.title,
          description: book.author,
          thumb_url: book.thumb_url,
          input_message_content: {
            message_text: createMessageText(book),
            parse_mode: "HTML"
          },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Show on Goodreads",
                  url: book.url
                }
              ]
            ]
          }
        }))
      : [];

  ctx.answerInlineQuery(results);
});
bot.launch();