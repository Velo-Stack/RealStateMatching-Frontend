const CODE_LENGTH = 6;

const getIdFromEntity = (entityOrId) => {
  if (entityOrId && typeof entityOrId === "object") {
    return entityOrId.id;
  }
  return entityOrId;
};

export const formatEntityCode = (prefix, entityOrId) => {
  const id = getIdFromEntity(entityOrId);
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) return "-";
  return `${prefix}-${String(numericId).padStart(CODE_LENGTH, "0")}`;
};

export const getOfferCode = (offerOrId) => {
  if (offerOrId && typeof offerOrId === "object" && offerOrId.offerCode) {
    return offerOrId.offerCode;
  }
  return formatEntityCode("OFF", offerOrId);
};

export const getRequestCode = (requestOrId) => {
  if (requestOrId && typeof requestOrId === "object" && requestOrId.requestCode) {
    return requestOrId.requestCode;
  }
  return formatEntityCode("REQ", requestOrId);
};
