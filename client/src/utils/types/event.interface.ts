export interface Event {
  id: string;
  title: string;
  start: string;
  end: string | undefined;
  display?: string;
}
