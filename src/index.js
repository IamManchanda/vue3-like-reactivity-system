/**
 * Modern Reactivity System in Vanilla JavaScript
 * (With ES6+ JavaScript - Proxy & Reflect)
 * Vue.js version 3 like implementation
 */

const targetMap = new WeakMap();

const track = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
    dep.add(effect);
  }
};

const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
};

const reactive = (target) => {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (result && oldValue != value) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
};

/**
 * Unleash the reactivity, Initialize
 */
let state = reactive({
  price: 0,
  quantity: 0,
});
let total = 0;
let effect = () => {
  total = state.price * state.quantity;
};
effect();

/**
 * Log Before Update
 */
console.log("Before Update", { ...state, total });

/**
 * Log After update: 1
 */
state.price = 5;
state.quantity = 2;
console.log("After update 1:", { ...state, total });

/**
 * Log After update: 2
 */
state.price = 20;
console.log("After update 2:", { ...state, total });

/**
 * Log After update: 3
 */
state.quantity = 5;
console.log("After update 3:", { ...state, total });
