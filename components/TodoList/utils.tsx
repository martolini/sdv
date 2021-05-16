import { Todo } from 'hooks/useTodos';
import nlp from 'compromise';
import dates from 'compromise-dates';
import numbers from 'compromise-numbers';

const enlp = nlp.extend(numbers).extend(dates);

export const formatTag = (tag: string) => {
  const regexString = /\[\[[^\]\]]*\]\]/gim;
  let m;
  let output = tag;
  while ((m = regexString.exec(tag)) !== null) {
    if (m.index === regexString.lastIndex) {
      regexString.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match) => {
      const jsonMatch = JSON.parse(match.substr(2, match.length - 4));
      output = output.replace(
        match,
        `<a href="https://stardewvalleywiki.com${jsonMatch.href}" target="_blank">${jsonMatch.value}</a>`
      );
    });
  }
  return output;
};

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const isRelevantToday = (todo: Todo, today: string) => {
  const dates = enlp(todo.text)
    .dates()
    .json()
    .map((d) => WEEKDAYS[new Date(d.start).getDay()]);
  if (dates.includes(today)) return true;
  return false;
};
