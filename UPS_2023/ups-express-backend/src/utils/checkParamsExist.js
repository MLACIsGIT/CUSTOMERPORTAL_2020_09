export default function checkParamsExist(params) {
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing parameter: ${key}`);
    }
  });
}
