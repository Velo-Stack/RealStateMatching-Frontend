export const getConvTitle = (conv, user) => {
  if (conv.title) return conv.title;
  if (conv.team) return conv.team.name;
  const others = conv.participants?.filter((p) => p.user?.id !== user?.id);
  if (others?.length === 1) return others[0].user?.name;
  return `محادثة (${conv.participants?.length || 0})`;
};

export const isMessageMine = (msg, user) =>
  msg.senderId === user?.id || msg.sender?.id === user?.id;

export const canEditMessage = (msg, user) => {
  if (!isMessageMine(msg, user)) return false;

  const messageTime = new Date(msg.createdAt).getTime();
  const now = Date.now();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  return (now - messageTime) < twentyFourHoursMs;
};

export const getTimeLeftToEdit = (msg) => {
  const messageTime = new Date(msg.createdAt).getTime();
  const now = Date.now();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  const timeLeft = twentyFourHoursMs - (now - messageTime);

  if (timeLeft <= 0) return null;

  const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

  if (hoursLeft > 0) {
    return `${hoursLeft} ساعة و ${minutesLeft} دقيقة`;
  }
  return `${minutesLeft} دقيقة`;
};
