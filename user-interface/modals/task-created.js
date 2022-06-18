const { Modal, Blocks } = require('slack-block-builder');

module.exports = (taskTitle, selectedUser,taskDueDate) => Modal({ title: 'Задача создана', callbackId: 'task-created-modal' })
  .blocks(
    Blocks.Section({
      text: `${taskTitle} \nИсполнитель: <@${selectedUser}> \nСрок исполнения: ${taskDueDate}`,
    }),
  ).buildToJSON();
