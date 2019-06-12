export default (args: any): any => {
  const notNullArgs = {};
  Object.keys(args).forEach(key => {
    if (args[key] !== null) {
      notNullArgs[key] = args[key];
    }
  });
  return notNullArgs;
};
