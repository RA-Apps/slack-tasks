const { completeTasks, reloadAppHome } = require('../../utilities');

const buttonMarkButtonAsDoneHomeCallback = async ({ ack, action, client, body }) => {
  try {
    await ack();
    const taskID = action.value.split('-')[1];
    await completeTasks([taskID], body.user.id, client);
    await reloadAppHome(client, body.user.id, body.team.id, 'open');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = { buttonMarkButtonAsDoneHomeCallback };
