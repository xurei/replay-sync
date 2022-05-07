/**
 * Converts a config object to its up-to-date version
 * @param config
 * @return a copy of the config object, updated to its last version
 */
export function migrateConfig(config) {
  config = { ... config };
  
  if (!config.configVersion) {
    config.configVersion = 1;
  }
  
  // Version 2 - converted startTimestamp/endTimestamp to a timeFrames array
  if (config.configVersion === 1) {
    config.configVersion = 2;
    config.timeFrames = [
      {
        startTimestamp: config.startTimestamp,
        endTimestamp: config.endTimestamp,
      }
    ];
    delete config.startTimestamp;
    delete config.endTimestamp;
  }
  
  return config;
}
