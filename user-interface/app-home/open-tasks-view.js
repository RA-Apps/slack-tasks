const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Elements,
  Input,
  Bits,
} = require("slack-block-builder");
const pluralize = require("pluralize");
const { DateTime } = require("luxon");

module.exports = (openTasks) => {
  const homeTab = HomeTab({
    callbackId: "tasks-home",
    privateMetaData: "open",
  }).blocks(
    Actions({ blockId: "task-creation-actions" }).elements(
      Elements.Button({ text: "Текущие задачи" })
        .value("app-home-nav-open")
        .actionId("app-home-nav-open")
        .primary(true),
      Elements.Button({ text: "Выполнено" })
        .value("app-home-nav-completed")
        .actionId("app-home-nav-completed"),
      Elements.Button({ text: "Назначены мной" })
        .actionId("app-home-nav-my")
        .value("app-home-nav-my"),
      Elements.Button({ text: "Создать задачу" })
        .value("app-home-nav-create-a-task")
        .actionId("app-home-nav-create-a-task")
    )
  );

  if (openTasks.length === 0) {
    homeTab.blocks(
      Header({ text: "Нет текущих задач" }),
      Divider(),
      Section({ text: "Похоже вы всё выполнили." })
    );
    return homeTab.buildToJSON();
  }

  /*
    Block kit Options have a maximum length of 10, and most people have more than 10 open tasks
    at a given time, so we break the openTasks list into chunks of ten
    and add them as multiple blocks.
  */
  const tasksInputsArray = [];
  let holdingArray = [];
  let start = 0;
  const end = openTasks.length;
  const maxOptionsLength = 10;
  for (start, end; start < end; start += maxOptionsLength) {
    holdingArray = openTasks.slice(start, start + maxOptionsLength);
    tasksInputsArray.push(
      Input({ label: " ", blockId: `open-task-status-change-${start}` })
        .dispatchAction()
        .element(
          Elements.Checkboxes({
            actionId: "blockOpenTaskCheckboxClicked",
          }).options(
            holdingArray.map((task) => {
              const option = {
                text: `*${task.title}*`,
                value: `open-task-${task.id}`,
              };
              option.description = `Срок исполнения: ${DateTime.fromJSDate(
                task.dueDate
              ).toRelativeCalendar()} \n`;
              return Bits.Option(option);
            })
          )
        )
    );
  }

  homeTab.blocks(
    Header({
      text: `У вас ${openTasks.length} открытых ${pluralize(
        "задач",
        openTasks.length
      )}`,
    }),
    Divider(),
    tasksInputsArray
  );

  return homeTab.buildToJSON();
};
