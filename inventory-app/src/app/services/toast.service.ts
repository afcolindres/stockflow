import { Injectable, signal } from "@angular/core";

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "warning" | "info";
  visible: boolean;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  private toast = signal<ToastMessage>({
    message: "",
    type: "info",
    visible: false,
  });

  readonly toast$ = this.toast.asReadonly();

  show(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration = 10000,
  ): void {
    this.toast.set({ message, type, visible: true });

    setTimeout(() => {
      this.toast.set({ message: "", type: "info", visible: false });
    }, duration);
  }

  hide(): void {
    this.toast.set({ message: "", type: "info", visible: false });
  }
}
