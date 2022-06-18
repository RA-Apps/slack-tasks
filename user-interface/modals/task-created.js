const { Modal, Blocks } = require('slack-block-builder');

module.exports = (taskTitle, taskDescription, selectedUser,taskDueDate) => Modal({ title: 'Задача создана', callbackId: 'task-created-modal' })
  .blocks(
    Blocks.Section({
      text: `${taskTitle} \n${taskDescription} \nИсполнитель: <@${selectedUser}> \nСрок исполнения: ${taskDueDate}`,
    }),
  ).buildToJSON();
