const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Elements,
  Blocks
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
      Elements.Button({ text: "Выполненные задачи" })
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

  let openTasksArray = [];
  openTasks.map((task) => {
    openTasksArray.push(
      Blocks.Section({
        text: `:pushpin: *${task.title}* \n ${task.description}`
      })
    );
    openTasksArray.push(
      Blocks.Context().elements(
        `Задачу назначил: :bust_in_silhouette: <@${task.creatorSlackId}>    Срок исполнения: :hourglass_flowing_sand: ${DateTime.fromJSDate(task.dueDate).toRelativeCalendar()}`
      )
    );
    openTasksArray.push(
      Blocks.Actions().elements(
      Elements.Button ({text: `:white_check_mark: Выполнено`})
      .value(`task-${task.id}`)
      .actionId('button-mark-as-done-home'),
      )
    );
    openTasksArray.push(
      Divider()
    );
  })
  homeTab.blocks(
    Header({
      text: `У вас ${openTasks.length} открытых ${pluralize(
        "задач",
        openTasks.length
      )}`,
    }),
    Divider(),
    openTasksArray
  );

  return homeTab.buildToJSON();
};