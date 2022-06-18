const { Modal, Blocks } = require('slack-block-builder');

module.exports = (taskTitle, taskDescription, selectedUser,taskDueDate) => Modal({ title: 'Задача создана', callbackId: 'task-created-modal' })
  .blocks(
    Blocks.Header({
      text: `${taskTitle}`,
    }),
    Blocks.Section({
      text: `${taskDescription}`,
    }),
    Blocks.Context().elements(`Исполнитель: :bust_in_silhouette: <@${selectedUser}>    Срок исполнения: :hourglass_flowing_sand: ${taskDueDate}`),

  ).buildToJSON();
