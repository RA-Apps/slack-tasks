const {
  HomeTab,
  Header,
  Divider,
  Section,
  Actions,
  Blocks,
  Utilities,
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
  let temp = [];
  homeTab.blocks(
    Blocks.Header({
      text: `У вас ${recentlyCompletedTasks.length} выполненных ${pluralize(
        "задач",
        recentlyCompletedTasks.length
      )}`,
    }),
    Divider(),
    recentlyCompletedTasks.map((task) => {
      temp.push(
        Blocks.Section({
          text: `:white_check_mark: *${task.title}* \n ${task.description}`,
        }).fields([
          `Срок исполнения: *${DateTime.fromJSDate(
            task.dueDate
          ).toRelativeCalendar()}*;   Назначил пользователь: <@${
            task.creatorSlackId
          }>`,
        ])
      );
      temp.push(
        Blocks.Context().elements(
          `Исполнитель: :bust_in_silhouette: ${task.creatorSlackId}    Срок исполнения: :hourglass_flowing_sand: Завтра`
        )
      );
      // Blocks.Divider(),
      // Blocks.Section({
      //   text: `:white_check_mark: *${task.title}* \n ${task.description}`,
      // }).fields([
      //   `Срок исполнения: *${DateTime.fromJSDate(
      //     task.dueDate
      //   ).toRelativeCalendar()}*;   Назначил пользователь: <@${
      //     task.creatorSlackId
      //   }>`
      // ])
    }),
    temp
    //   Blocks.Section({
    //     text: `:white_check_mark: *Неподкупность государственных СМИ сделала своё дело*`,
    //   }),
    //   Blocks.Section({
    //     text: `Вот вам яркий пример современных тенденций — курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации новых принципов формирования материально-технической и кадровой базы. Противоположная точка зрения подразумевает, что некоторые особенности внутренней политики представлены в исключительно положительном свете.`,
    //   }),
    //   Blocks.Actions().elements(
    //     Elements.Button({ text: `:large_green_circle: Возобновить`})
    //       .actionId('reopen'),
    //     Elements.Button({ text: `Удалить`})
    //       .actionId('delete')
    //       .danger()
    //   ),
    //   Blocks.Context().elements(`Исполнитель: :bust_in_silhouette: @Роман Апанович    Срок исполнения: :hourglass_flowing_sand: Завтра`),
    //   Blocks.Divider(),
    //   Blocks.Section({
    //     text: `:white_check_mark: *Неподкупность государственных СМИ сделала своё дело*`,
    //   }),
    //   Blocks.Section({
    //     text: `Вот вам яркий пример современных тенденций — курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации новых принципов формирования материально-технической и кадровой базы. Противоположная точка зрения подразумевает, что некоторые особенности внутренней политики представлены в исключительно положительном свете.`,
    //   }),
    //   Blocks.Actions().elements(
    //     Elements.Button({ text: `:large_green_circle: Возобновить`})
    //       .actionId('reopen'),
    //     Elements.Button({ text: `Удалить`})
    //       .actionId('delete')
    //       .danger()
    //   ),
    //   Blocks.Context().elements(`Исполнитель: :bust_in_silhouette: @Роман Апанович    Срок исполнения: :hourglass_flowing_sand: Завтра`),
    //   Blocks.Divider(),
    //   Blocks.Section({
    //     text: `:white_check_mark: *Неподкупность государственных СМИ сделала своё дело*`,
    //   }),
    //   Blocks.Section({
    //     text: `Вот вам яркий пример современных тенденций — курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации новых принципов формирования материально-технической и кадровой базы. Противоположная точка зрения подразумевает, что некоторые особенности внутренней политики представлены в исключительно положительном свете.`,
    //   }),
    //   Blocks.Actions().elements(
    //     Elements.Button({ text: `:large_green_circle: Возобновить`})
    //       .actionId('reopen'),
    //     Elements.Button({ text: `Удалить`})
    //       .actionId('delete')
    //       .danger()
    //   ),
    //   Blocks.Context().elements(`Исполнитель: :bust_in_silhouette: @Роман Апанович    Срок исполнения: :hourglass_flowing_sand: Завтра`),
    //   Blocks.Divider()
  );
  return homeTab.buildToJSON();
};
