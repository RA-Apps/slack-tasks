const { Message, Section, Button } = require('slack-block-builder');

module.exports = (postAt, channel, taskTitle, dueDate, taskID) => Message({
  channel,
  postAt,
  text: `У вас есть невыполненная задача: "${taskTitle}".`,
}).blocks(
  Section({ text: `:wave: У вас есть невыполненная задача: "*${taskTitle}*".` })
    .accessory(Button({ text: 'Задача выполнена', value: `task-${taskID}`, actionId: 'button-mark-as-done' })),
  Section().fields(['*Наименование*', '*Срок исполнения*', taskTitle, dueDate]),
).buildToObject();
