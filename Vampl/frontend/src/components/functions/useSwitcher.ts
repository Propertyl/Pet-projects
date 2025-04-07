import type { Ref } from "vue";

const useSwitcher = (param:Ref<Boolean>) => {
  return () => param.value = !param.value;
}

export default useSwitcher;