import fs from "fs";
const maxIterations = 10;

/**
 * reads and parses a json file
 * @param path file path to read from
 * @returns parsed json or throws error
 */
function getFile(path: string): JSON {
  //read file
  try {
    var raw: string = fs.readFileSync(path, "utf-8");
  } catch (error) {
    throw `Unable to read config file at path: ${path}\nerror:\n${error}`;
  }

  //parse file
  try {
    var file: JSON = JSON.parse(raw);
  } catch (error) {
    throw `Unable to parse config file at path: ${path}\nerror:\n${error}`;
  }

  //return json
  return file;
}

/**
 * validates a config file recursivly
 * @param config json - config
 * @param validator json - validator
 * @param trace string - used for tracking errors inside of recursion, pass an empty string
 * @param currentIterations number - used for preventing infinite recursion, pass zero
 */
function RecursivlyValidateConfig(
  config: any,
  validator: any,
  trace: string,
  currentIterations: number
) {
  currentIterations++;
  let keys = Object.keys(validator);
  for (let i = 0; i < keys.length; i++) {
    if (typeof keys[i] == "object") {
      if (typeof config[keys[i]] == "object") {
        if (currentIterations <= maxIterations) {
          RecursivlyValidateConfig(
            config[keys[i]],
            validator[keys[i]],
            `${trace}.${keys[i]}`,
            currentIterations
          );
        }
      } else {
        // prettier choses perhaps the single uglyest possible spot to add a linebreak and I hate it
        // prettier-ignore
        throw `Unable to validate config at: ${trace}.${keys[i]}, expected type: "object", got type: ${typeof config[keys[i]]}`;
      }
    } else {
      if (typeof config[keys[i]] !== validator[keys[i]]) {
        // prettier choses perhaps the single uglyest possible spot to add a linebreak and I hate it
        // prettier-ignore
        throw `Unable to validate config at: ${trace}.${keys[i]}, expected type: "${validator[keys[i]]}", got type: ${typeof config[keys[i]]}`;
      }
    }
  }
}

/**
 * loads and validates a config file based on provided config, if you dont want to validate use getFile() instead
 * @param path string - path to json config file
 * @param validator json - validator to use
 * @returns json - config file
 */
function loadConfig(path: string, validator: any) {
  const config = getFile(path);
  RecursivlyValidateConfig(config, validator, "", 0);
  return config;
}

export { loadConfig, getFile };
export default loadConfig;
