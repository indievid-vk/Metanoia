const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/catechesis.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const textToRemove = [
  "Сайт автора: https://uralzvon.site",
  "Сайт автора на YouTube: https://www.youtube.com/channel/UCwYcrQKASQuicZJq5eB_uEg",
  "Заказать материалы автора: https://школапокаяния.рф",
  "КРАТКАЯ ЭКСКУРСИЯ ПО ЛЕКЦИЯМ И КНИГАМ АВТОРА: https://www.youtube.com/watch?v=s9S4SYJJyo0&feature=emb_logo",
  "ОТЗЫВЫ СЛУШАТЕЛЕЙ: https://www.youtube.com/watch?v=Yrx8LVMzBbI&feature=emb_logo",
  "Заказать собрание свт. Игнатия (Брянчанинова): https://школапокаяния.рф/collection/knigi-drugih-avtorov/product/sobranie-tvoreniy-svt-ignatiya-bryanchaninova-v-7-tomah-2",
  "Отзывы о трудах свт. Игнатия: https://www.youtube.com/watch?v=ZgUq2nzHkbM",
  "Алфавитный указатель по лекциям автора: https://uralzvon.site/алфавитный"
];

const cleanedData = data.map(item => {
  let description = item.description || "";
  
  textToRemove.forEach(line => {
    // Remove the line and any following newline
    const regex = new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g');
    description = description.replace(regex, '');
  });

  // Clean up multiple newlines at the start or end
  description = description.trim();

  return {
    ...item,
    description
  };
});

fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2), 'utf8');
console.log('Cleanup complete');
