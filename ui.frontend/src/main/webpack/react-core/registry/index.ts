export type Storage<T> = {
  [key: string]: T;
};

export interface IRegistry<T> {
  register(name: string, object: T): void;
  get(name: string): T;
}

class Registry<T> implements IRegistry<T> {
  private storage: Storage<T>;

  constructor() {
    this.storage = {};
  }

  public get(name: string): T {
    if (!this.storage[name]) {
      throw new Error(`${name} not registered`);
    }
    return this.storage[name];
  }

  public register(name: string, object: T): void {
    if (this.storage[name]) {
      throw new Error(`${name} already registered`);
    }
    this.storage[name] = object;
  }
}

declare global {
  interface Window {
    ComponentRegistry: IRegistry<any>;
  }
}

function getComponentRegistry() {
  if (!window.ComponentRegistry) {
    window.ComponentRegistry = new Registry();
  }

  return window.ComponentRegistry;
}

export function registerComponent(name: string, object: any): void {
  getComponentRegistry().register(name, object);
}
