const { Modal, Blocks } = require('slack-block-builder');

module.exports = (taskTitle) => Modal({ title: 'Задача создана', callbackId: 'task-created-modal' })
  .blocks(
    Blocks.Section({
      text: `${taskTitle}`,
    }),
  ).buildToJSON();
