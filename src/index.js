/**
 * Modern Reactivity System in Vanilla JavaScript
 * (With ES6+ JavaScript - Proxy & Reflect)
 * Vue.js version 3 like implementation
 */

/**
 * targetMap stores the effects that each
 * object should re-run when it's updated
 */
const targetMap = new WeakMap();

/**
 * Track Function
 * @param {*} target
 * @param {*} key
 */
const track = (target, key) => {
  /**
   * We need to make sure this effect is being tracked
   * Get the current depsMap for this target.
   */
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    /**
     * If there is no map, then create one
     */
    targetMap.set(target, (depsMap = new Map()));
  }

  /**
   * Get the current dependencies (effects)
   * that need to be run when this is set
   */
  let dep = depsMap.get(key);

  if (!dep) {
    /**
     * If there is no dependencies (effects),
     * then create a new Set
     */
    depsMap.set(key, (dep = new Set()));

    /**
     * Add the effect to dependency map
     */
    dep.add(effect);
  }
};

/**
 * Trigger Function
 * @param {*} target
 * @param {*} key
 */
const trigger = (target, key) => {
  /**
   * Does this object have any properties
   * that have dependencies (effects) ???
   */
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    /**
     * If there is no map, then just return back!
     */
    return;
  }

  /**
   * Check if there are dependencies (effects)
   * associated with this ???
   */
  let dep = depsMap.get(key); // If there are dependencies (effects) associated with this
  if (dep) {
    /**
     * If dependencies (effects) exists,
     * then run them all
     */
    dep.forEach((effect) => {
      effect();
    });
  }
};

/**
 * Reactive Function
 * @param {*} target
 */
const reactive = (target) => {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);

      /**
       * If this reactive property (target) is GET
       * inside then track the effect to rerun on SET
       */
      track(target, key);

      return result;
    },

    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);

      if (result && oldValue != value) {
        /**
         * If this reactive property (target) has
         * effects to rerun on SET, trigger them.
         */
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
