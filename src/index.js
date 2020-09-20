/**
 * Modern Reactivity System in Vanilla JavaScript
 * (With ES6+ JavaScript - Proxy & Reflect)
 * Vue.js version 3 like implementation
 */

let activeEffect = null;
const targetMap = new WeakMap();

const track = (target, key) => {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
      dep.add(activeEffect);
    }
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

const ref = (raw) => {
  const r = {
    get value() {
      track(r, "value");
      return raw;
    },
    set value(newVal) {
      raw = newVal;
      trigger(r, "value");
    },
  };
  return r;
};

const effect = (eff) => {
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
};

// Unleash the reactivity
let state = reactive({
  price: 0,
  quantity: 0,
});
let salePrice = ref(0);
let total = 0;

effect(() => {
  salePrice.value = state.price * 0.9;
});

effect(() => {
  total = salePrice.value * state.quantity;
});

const objectToLog = () => ({
  price: state.price,
  quantity: state.quantity,
  salePrice: salePrice.value,
  total,
});

// Log before Update
console.log("Before Update", objectToLog());
// => Before Update { price: 0, quantity: 0, salePrice: 0, total: 0 }

// Log after update: 1
state.price = 5;
state.quantity = 2;
console.log("After update 1:", objectToLog());
// => After update 1: { price: 5, quantity: 2, salePrice: 4.5, total: 9 }

// Log after update: 2
state.price = 20;
console.log("After update 2:", objectToLog());
// => After update 2: { price: 20, quantity: 2, salePrice: 18, total: 36 }

// Log after update: 3
state.quantity = 5;
console.log("After update 3:", objectToLog());
// => After update 3: { price: 20, quantity: 5, salePrice: 18, total: 90 }
