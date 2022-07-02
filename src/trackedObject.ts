export class TrackedObject<T extends object> implements ProxyHandler<T> {
  constructor(target: any) {
    const handler: ProxyHandler<any> = {
      get: function (obj, prop) {
        console.log('get invoked for prop:: ', prop);
        return prop;
      },
      set: function (
        target: any,
        prop: string | symbol,
        value: any,
        receiver: any
      ): boolean {
        console.log('set invoked for prop:: ', prop, ' and value:: ', value);
        return true;
      },
    };
    (this as any).__proto__.__proto__ = new Proxy(target, handler);
  }
}
