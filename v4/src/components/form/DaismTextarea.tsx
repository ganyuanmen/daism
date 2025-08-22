import { Form } from 'react-bootstrap';
import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from 'react';
import ErrorBar from './ErrorBar';

// 外部可以调用的方法类型
export interface DaismTextareaHandle {
  getData: () => string;
  notValid: (errorText: string) => void;
}

// Props 类型
interface DaismTextareaProps {
  title: string;
  defaultValue?: string;
}

const DaismTextarea = forwardRef<DaismTextareaHandle, DaismTextareaProps>(
  ({ title, defaultValue }, ref) => {
    const editRef = useRef<HTMLTextAreaElement | null>(null);
    const [showError, setShowError] = useState(false);
    const [invalidText, setInvalidText] = useState('');

    const getData = () => {
      return editRef.current?.value ?? '';
    };

    const notValid = (errorText: string) => {
      setShowError(true);
      setInvalidText(errorText);
    };

    useImperativeHandle(ref, () => ({
      getData,
      notValid,
    }));

    return (
      <Form.Group className="mb-3">
        <Form.Label
          className="mb-0"
          style={{ marginLeft: '6px' }}
        >
          {title}:
        </Form.Label>
        <Form.Control
          as="textarea"
          isInvalid={showError}
          onFocus={() => {
            setShowError(false);
          }}
          defaultValue={defaultValue}
          ref={editRef}
          rows={3}
        />
        <ErrorBar
          show={showError}
          target={editRef.current} // 用函数返回 DOM 元素，避免类型错误
          placement="top"
          invalidText={invalidText}
        />
      </Form.Group>
    );
  }
);

export default React.memo(DaismTextarea);
