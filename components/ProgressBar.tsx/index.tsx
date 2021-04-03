import { Pane } from 'evergreen-ui';

export type ProgressBarProps = {
  // Between 0 and 1
  percentage: number;
  width: number | string;
  height: number | string;
};

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <Pane>
      <Pane></Pane>
    </Pane>
  );
}
