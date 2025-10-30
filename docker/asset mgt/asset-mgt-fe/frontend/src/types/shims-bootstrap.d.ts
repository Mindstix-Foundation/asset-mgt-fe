declare module 'bootstrap' {
  export class Modal {
    constructor(element: HTMLElement | null, options?: any)
    static getInstance(element: HTMLElement | null): Modal | null
    show(): void
    hide(): void
  }
} 