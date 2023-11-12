export function isEmpty(value) {
  return value.trim().length === 0;
}

export function isNumber(value) {
  return !isNaN(value);
}

export function isInteger(value) {
  // console.log(5);
  return Number.isInteger(+value);
}

export function isPositiveInteger(value) {
  return value.match(/^\d*$/g) !== null;
}

export function makeCaps(value) {
  return value.toUpperCase();
}

export function isGstNo(value) {
  return value.match(/^( )?[a-zA-Z0-9]*$/g) !== null;
}

export function isBlank(value) {
  return value == '';
}
