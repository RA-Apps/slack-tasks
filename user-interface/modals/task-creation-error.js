const { Modal, Blocks } = require('slack-block-builder');

module.exports = (taskTitle) => Modal({ title: 'Что-то пошло не так', callbackId: 'task-creation-error-modal' })
  .blocks(
    Blocks.Section({
      text: `Мы не могли создать ${taskTitle}. Извините!`,
    }),
  ).buildToJSON();
