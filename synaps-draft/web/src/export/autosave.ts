import { useBuildingStore } from '../store/useBuildingStore';
import { STORAGE_KEY } from './jsonFile';

/** Autosave building vào localStorage, debounce 500ms sau mỗi thay đổi. */
export function startAutosave(): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const unsubscribe = useBuildingStore.subscribe((state) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.building));
      } catch {
        // localStorage đầy hoặc bị chặn: autosave im lặng bỏ qua.
      }
    }, 500);
  });
  return () => {
    if (timer) clearTimeout(timer);
    unsubscribe();
  };
}
