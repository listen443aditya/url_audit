// src/utils/semaphore.ts
export class Semaphore {
  private tasks: (() => void)[] = [];

  constructor(
    private readonly max: number,
    private current = 0,
  ) {}

  public acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.current < this.max) {
        this.current++;
        resolve();
      } else {
        this.tasks.push(resolve);
      }
    });
  }

  public release(): void {
    if (this.tasks.length > 0) {
      const next = this.tasks.shift();
      next?.();
    } else {
      this.current--;
    }
  }
}

export const fetchSemaphore = new Semaphore(
  Number(process.env.MAX_CONCURRENT_FETCHES || 5),
);
