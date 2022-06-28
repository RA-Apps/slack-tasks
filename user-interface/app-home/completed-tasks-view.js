const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
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
      Elements.Button({ text: "Выполнено" })
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

  homeTab.blocks(
    Header({
      text: `У вас ${recentlyCompletedTasks.length} выполненных ${pluralize(
        "задач",
        recentlyCompletedTasks.length
      )}`,
    }),
    Divider(),
    recentlyCompletedTasks.map((task) =>
      Section()
        .fields([`:white_check_mark: ~*${task.title}*~`])
        .fields([`\n`])
        .fields([`${task.description}`])
        .fields([`\n`])
        .fields([
          `Срок исполнения: *${DateTime.fromJSDate(
            task.dueDate
          ).toRelativeCalendar()}*`,
        ])
        .fields([`\n`])
        .fields([`Задача назначена пользователем: <@${task.creatorSlackId}>`])
        .fields([`\n`])
        .accessory(
          Elements.Button({ text: "Возобновить" })
            .value(`${task.id}`)
            .actionId("reopen-task")
        )
    )
  );
  return homeTab.buildToJSON();
};
