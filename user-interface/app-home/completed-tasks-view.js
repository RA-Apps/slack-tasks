const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Blocks,
  Elements,
  user,
} = require("slack-block-builder");
const pluralize = require("pluralize");
const { DateTime } = require("luxon");

module.exports = (recentlyCompletedTasks) => {
  const homeTab = HomeTab({
    callbackId: "tasks-home",
    privateMetaData: "completed",
  }).blocks(
    Actions({ blockId: "task-creation-actions" }).elements(
      Elements.Button({ text: "Текущие задачи" })
        .value("app-home-nav-open")
        .actionId("app-home-nav-open"),
      Elements.Button({ text: "Выполненные задачи" })
        .value("app-home-nav-completed")
        .actionId("app-home-nav-completed")
        .primary(true),
      Elements.Button({ text: "Назначены мной" })
        .actionId("app-home-nav-my")
        .value("app-home-nav-my"),
      Elements.Button({ text: "Создать задачу" })
        .value("app-home-nav-create-a-task")
        .actionId("app-home-nav-create-a-task")
    )
  );

  if (recentlyCompletedTasks.length === 0) {
    homeTab.blocks(
      Header({ text: "Нет выполненных задач" }),
      Divider(),
      Section({ text: "Похоже, у вас нет завершённых задач." })
    );
    return homeTab.buildToJSON();
  }
  let completedTasksArray = [];
  homeTab.blocks(
    Blocks.Header({
      text: `У вас ${recentlyCompletedTasks.length} выполненных ${pluralize(
        "задач",
        recentlyCompletedTasks.length
      )}`,
    }),
    Divider(),
    recentlyCompletedTasks.map((task) => {
      completedTasksArray.push(
        Blocks.Section({
          text: `:white_check_mark: *${task.title}* \n ${task.description}`,
        })
      );
      completedTasksArray.push(
        Blocks.Context().elements(
          `Назначил пользователь: :bust_in_silhouette: <@${task.creatorSlackId}>    Срок исполнения: :hourglass_flowing_sand: ${DateTime.fromJSDate(task.dueDate).toRelativeCalendar()}`
        )
      );
      completedTasksArray.push(
        Blocks.Actions().elements(
        Elements.Button({ text: `:refresh: Возобновить`})
        .value(`${task.id}`)
        .actionId('reopen-task')
      )
      );
      completedTasksArray.push (
        Divider()
      );
    }),
    completedTasksArray
  );
  return homeTab.buildToJSON();
};
