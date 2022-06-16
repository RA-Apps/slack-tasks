const { Modal, Blocks, Elements } = require('slack-block-builder');
const { Multiline } = require('slack-block-builder/dist/methods');

module.exports = (prefilledTitle, currentUser) => {
  const textInput = (taskTitle) => {
    if (taskTitle) {
      return Elements.TextInput({
        placeholder: 'Нужно это сделать',
        actionId: 'taskTitle',
        initialValue: taskTitle,
      });
    }
    return Elements.TextInput({
      placeholder: 'Нужно это сделать',
      actionId: 'taskTitle',
    });
  };

  return Modal({ title: 'Новая задача', submit: 'Создать', callbackId: 'new-task-modal' })
    .blocks(
      Blocks.Input({ label: 'Наименование', blockId: 'taskTitle' }).element(
        textInput(prefilledTitle),
      ),
      Blocks.Input({ label: 'Наименование', blockId: 'descriptionTitle' }).element(
        Elements.TextInput({
          multiline: true,
        }),
      ),
      Blocks.Input({ label: 'Ответственный', blockId: 'taskAssignUser' }).element(
        Elements.UserSelect({
          actionId: 'taskAssignUser',
        }).initialUser(currentUser),
      ),
      Blocks.Input({ label: 'Срок исполнения', blockId: 'taskDueDate', optional: true }).element(
        Elements.DatePicker({
          actionId: 'taskDueDate',
        }),
      ),
      Blocks.Input({ label: 'Время', blockId: 'taskDueTime', optional: true }).element(
        Elements.TimePicker({
          actionId: 'taskDueTime',
        }),
      ),
    ).buildToJSON();
};
