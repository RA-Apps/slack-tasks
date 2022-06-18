const { Modal, Blocks, Elements } = require('slack-block-builder');
const { Multiline } = require('slack-block-builder/dist/methods');

module.exports = (prefilledTitle, currentUser) => {
  const textInput = (taskTitle) => {
    if (taskTitle) {
      return Elements.TextInput({
        placeholder: 'Что нежно сделать?',
        actionId: 'taskTitle',
        initialValue: taskTitle,
      });
    }
    return Elements.TextInput({
      placeholder: 'Что нежно сделать?',
      actionId: 'taskTitle',
    });
  };

  return Modal({ title: 'Новая задача', submit: 'Создать', callbackId: 'new-task-modal' })
    .blocks(
      Blocks.Input({ label: 'Наименование', blockId: 'taskTitle' }).element(
        textInput(prefilledTitle),
      ),
      Blocks.Input({ label: 'Описание', blockId: 'taskDescription', optional: true }).element(
        Elements.TextInput({
          actionId: 'taskDescription',
          multiline: true,
        }),
      ),
      Blocks.Input({ label: 'Ответственный', blockId: 'taskAssignUser' }).element(
        Elements.UserSelect({
          actionId: 'taskAssignUser',
        }).initialUser(currentUser),
      ),
      Blocks.Input({ label: 'Срок исполнения', blockId: 'taskDueDate' }).element(
        Elements.DatePicker({
          actionId: 'taskDueDate',
        }),
      ),
      Blocks.Input({ label: 'Время', blockId: 'taskDueTime' }).element(
        Elements.TimePicker({
          actionId: 'taskDueTime',
        }),
      ),
    ).buildToJSON();
};
