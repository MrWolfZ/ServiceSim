import EventEmitter from 'events';

const emitter = new EventEmitter();

export const bus = {
  publish(type = 'event', payload: any) {
    emitter.emit(type, payload);
  },

  subscribe(type = 'event', cb: (payload: any) => any) {
    emitter.on(type, cb);

    return () => emitter.removeListener(type, cb);
  },
};
