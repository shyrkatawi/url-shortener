export type GenerateAliasOptions = {
  retry?: number;
  size?: number;
};

const prepareNumberOption = (options: {
  defaultValue: number;
  minValue: number;
  maxValue: number;
  value: number | undefined;
}): number => {
  if (options.value === undefined) {
    return options.defaultValue;
  }
  if (options.value < options.minValue || options.value > options.maxValue) {
    return options.defaultValue;
  }
  return options.value;
};

export const prepareGenerateAliasOptions = (
  options: GenerateAliasOptions = {},
): Required<GenerateAliasOptions> => {
  return {
    retry: prepareNumberOption({
      defaultValue: 3,
      minValue: 0,
      maxValue: 10,
      value: options.retry,
    }),
    size: prepareNumberOption({
      defaultValue: 20,
      minValue: 1,
      maxValue: 20,
      value: options.size,
    }),
  };
};
