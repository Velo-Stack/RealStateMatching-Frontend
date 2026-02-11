export const getConvTitle = (conv, user) => {
  if (conv.title) return conv.title;
  if (conv.team) return conv.team.name;
  const others = conv.participants?.filter((p) => p.user?.id !== user?.id);
  if (others?.length === 1) return others[0].user?.name;
  return `محادثة (${conv.participants?.length || 0})`;
};

export const isMessageMine = (msg, user) =>
  msg.senderId === user?.id || msg.sender?.id === user?.id;
