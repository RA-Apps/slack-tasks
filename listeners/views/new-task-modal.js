const { DateTime } = require('luxon');

const { User, Task } = require('../../models');
const { modals } = require('../../user-interface');
const { taskReminder } = require('../../user-interface/messages');
const { reloadAppHome } = require('../../utilities');

const newTaskModalCallback = async ({ ack, view, body, client }) => {
  const providedValues = view.state.values;

  const taskTitle = providedValues.taskTitle.taskTitle.value;
  console.log (taskTitle);
  const taskDescription = providedValues.taskDescription.taskDescription.value;
  console.log(taskDescription);
  const selectedDate = providedValues.taskDueDate.taskDueDate.selected_date;
  const selectedTime = providedValues.taskDueTime.taskDueTime.selected_time;

  const selectedUser = providedValues.taskAssignUser.taskAssignUser.selected_user;

  const task = Task.build({title: taskTitle});

  const taskDueDate = DateTime.fromISO(`${selectedDate}T${selectedTime}`).toRelativeCalendar();
  // task.description = taskDescription;
  if (selectedDate) {
    if (!selectedTime) {
      await ack({
        response_action: 'errors',
        errors: {
          taskDueTime: "Пожалуйста, установите время для выбранной вами даты",
        },
      });
      return;
    }
    const taskDueDate = DateTime.fromISO(`${selectedDate}T${selectedTime}`);
    const diffInDays = taskDueDate.diffNow('days').toObject().days;
    // Task due date is in the past, so reject
    if (diffInDays < 0) {
      await ack({
        response_action: 'errors',
        errors: {
          taskDueDate: 'Пожалуйста, выберите дату в будущем',
          taskDueTime: 'Пожалуйста, выберите время в будущем',
        },
      });
      return;
    }
    task.dueDate = taskDueDate;
  }

  try {
    // Grab the creating user from the DB
    const queryResult = await User.findOrCreate({
      where: {
        slackUserID: body.user.id,
        slackWorkspaceID: body.team.id,
      },
    });
    const user = queryResult[0];

    // Grab the assignee user from the DB
    const querySelectedUser = await User.findOrCreate({
      where: {
        slackUserID: selectedUser,
        slackWorkspaceID: body.team.id, // TODO better compatibility with Slack Connect.
      },
    });
    const selectedUserObject = querySelectedUser[0];

    // Persist what we know about the task so far
    await task.save();
    await task.setCreator(user);
    await task.setCurrentAssignee(selectedUserObject);

    if (task.dueDate) {
      const dateObject = DateTime.fromJSDate(task.dueDate);
      // The `chat.scheduleMessage` endpoint only accepts messages in the next 120 days,
      // so if the date is further than that, don't set a reminder, and let the user know.
      const assignee = await task.getCurrentAssignee();
      if (dateObject.diffNow('days').toObject().days < 120) {
        await client.chat
          .scheduleMessage(
            taskReminder(
              dateObject.toSeconds(),
              assignee.slackUserID,
              task.title,
              dateObject.toRelativeCalendar(),
              task.id,
            ),
          )
          .then(async (response) => {
            task.scheduledMessageId = response.scheduled_message_id;
            await task.save();
          });
      } else {
        // TODO better error message and store it in /user-interface
        await client.chat.postMessage({
          text: `Извините, но мы не смогли установить задачу ${taskTitle} позже, поскольку до этого момента исполнения осталось более 120 дней`,
          channel: assignee.slackUserID,
        });
      }
    }
    await task.save();
    await ack({
      response_action: 'update',
      view: modals.taskCreated(taskTitle, selectedUser,taskDueDate),
    });
    if (selectedUser !== body.user.id) {
      const taskDueDate = DateTime.fromISO(`${selectedDate}T${selectedTime}`).toRelativeCalendar();
      await client.chat.postMessage({
        channel: selectedUser,
        text: `:new: задача назначена пользователем: <@${body.user.id}>\n:round_pushpin: *${taskTitle}*\n  срок исполнения: *${taskDueDate}*`,
      });
      await reloadAppHome(client, selectedUser, body.team.id);
    }

    await reloadAppHome(client, body.user.id, body.team.id);
  } catch (error) {
    await ack({
      response_action: 'update',
      view: modals.taskCreationError(taskTitle),
    });
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = { newTaskModalCallback };
