import { Overlay, Popover } from 'react-bootstrap';
import type { Placement } from 'react-bootstrap/esm/types';

// 定义 Props 类型
interface ErrorBarProps {
  show: boolean;
  target: HTMLElement | null;
  placement?: Placement; // 可选，默认值由 react-bootstrap 控制
  invalidText?: string;
}

export default function ErrorBar({
  show,
  target,
  placement = 'right',
  invalidText = '',
}: ErrorBarProps) {
  return (
    <Overlay
      show={show}
      target={target}
      placement={placement}
      containerPadding={20}
    >
      <Popover>
        <Popover.Body style={{ color: 'red' }}>
          {invalidText}
        </Popover.Body>
      </Popover>
    </Overlay>
  );
}
