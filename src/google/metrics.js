export function createMetrics({ enabled = true, log = console.log } = {}) {
  return {
    emit(name, value = 1, dimensions = {}, unit = 'Count') {
      if (!enabled) return;
      log(JSON.stringify({ severity: 'INFO', message: `metric ${name}`, metric: name, value, unit, labels: dimensions, 'logging.googleapis.com/labels': { metric: name } }));
    },
  };
}
